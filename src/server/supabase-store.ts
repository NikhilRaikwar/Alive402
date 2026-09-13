import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AccessRun, Alive402Store, Enrollment } from "@alive402/sdk";

export class SupabaseAlive402Store implements Alive402Store {
  // `numeric(78,0)` nullifiers must travel as decimal strings. The generated
  // Supabase type represents `numeric` as number, which would lose precision.
  private client: SupabaseClient;
  constructor(url: string, serviceKey: string) {
    this.client = createClient(url, serviceKey, { auth: { persistSession: false } });
  }

  private mapEnrollment(row: Record<string, unknown>): Enrollment {
    return {
      id: String(row["id"]),
      providerId: String(row["provider_id"]),
      action: String(row["action"]),
      nullifier: String(row["nullifier"]),
      granted: Number(row["granted"]),
      consumed: Number(row["consumed"]),
      verifiedAt: String(row["verified_at"]),
    };
  }

  async grant(input: Omit<Enrollment, "id" | "consumed" | "verifiedAt">) {
    const { data, error } = await this.client
      .from("alive402_enrollments")
      .upsert(
        {
          provider_id: input.providerId,
          action: input.action,
          nullifier: input.nullifier,
          granted: input.granted,
        },
        { onConflict: "provider_id,action,nullifier", ignoreDuplicates: true },
      )
      .select()
      .maybeSingle();
    if (error) throw error;
    if (data) return this.mapEnrollment(data);
    const existing = await this.getEnrollment(input.providerId, input.action, input.nullifier);
    if (!existing) throw new Error("Enrollment was not persisted");
    return existing;
  }

  async getEnrollment(providerId: string, action: string, nullifier: string) {
    const { data, error } = await this.client
      .from("alive402_enrollments")
      .select("*")
      .eq("provider_id", providerId)
      .eq("action", action)
      .eq("nullifier", nullifier)
      .maybeSingle();
    if (error) throw error;
    return data ? this.mapEnrollment(data) : null;
  }

  async consumePromotion(enrollmentId: string) {
    const { data, error } = await this.client.rpc("consume_alive402_promotion", {
      enrollment_id_input: enrollmentId,
    });
    if (error) throw error;
    return data === true;
  }

  async createSession(enrollmentId: string, tokenHash: string, expiresAt: string) {
    const { error } = await this.client.from("alive402_sessions").insert({
      enrollment_id: enrollmentId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });
    if (error) throw error;
  }

  async resolveSession(tokenHash: string) {
    const { data, error } = await this.client
      .from("alive402_sessions")
      .select("enrollment_id,expires_at")
      .eq("token_hash", tokenHash)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    if (error || !data) return null;
    const result = await this.client
      .from("alive402_enrollments")
      .select("*")
      .eq("id", data.enrollment_id)
      .maybeSingle();
    if (result.error) throw result.error;
    return result.data ? this.mapEnrollment(result.data) : null;
  }

  async recordRun(run: AccessRun) {
    const { error } = await this.client.from("alive402_runs").insert({
      id: run.id,
      provider_id: run.providerId,
      mode: run.mode,
      decision: run.decision,
      prompt: run.prompt,
      transaction: run.transaction,
      amount: run.amount,
      created_at: run.createdAt,
    });
    if (error) throw error;
  }
  async updateRun(id: string, patch: Partial<AccessRun>) {
    const mapped: Record<string, unknown> = {};
    if (patch.mode) mapped["mode"] = patch.mode;
    if (patch.decision) mapped["decision"] = patch.decision;
    if (patch.transaction) mapped["transaction"] = patch.transaction;
    if (patch.amount) mapped["amount"] = patch.amount;
    const { error } = await this.client.from("alive402_runs").update(mapped).eq("id", id);
    if (error) throw error;
  }
  private mapRun(row: Record<string, unknown>): AccessRun {
    return {
      id: String(row["id"]),
      providerId: String(row["provider_id"]),
      mode: row["mode"] as AccessRun["mode"],
      decision: String(row["decision"]),
      createdAt: String(row["created_at"]),
      ...(row["prompt"] ? { prompt: String(row["prompt"]) } : {}),
      ...(row["transaction"] ? { transaction: String(row["transaction"]) } : {}),
      ...(row["amount"] ? { amount: String(row["amount"]) } : {}),
    };
  }
  async getRun(id: string) {
    const { data } = await this.client.from("alive402_runs").select("*").eq("id", id).maybeSingle();
    return data ? this.mapRun(data) : null;
  }
  async listRuns(providerId: string, limit = 25) {
    const { data, error } = await this.client
      .from("alive402_runs")
      .select("*")
      .eq("provider_id", providerId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row) => this.mapRun(row));
  }
}
