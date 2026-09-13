import type { AccessRun, Alive402Store, Enrollment, WorldChallenge } from "./types.ts";

export class MemoryAlive402Store implements Alive402Store {
  private enrollments = new Map<string, Enrollment>();
  private sessions = new Map<string, { enrollmentId: string; expiresAt: string }>();
  private challenges = new Map<string, WorldChallenge & { consumed: boolean }>();
  private runs = new Map<string, AccessRun>();
  private locks = new Set<string>();

  private key(providerId: string, action: string, nullifier: string) {
    return `${providerId}:${action}:${nullifier}`;
  }

  async grant(input: Omit<Enrollment, "id" | "consumed" | "verifiedAt">) {
    const key = this.key(input.providerId, input.action, input.nullifier);
    const existing = this.enrollments.get(key);
    if (existing) return existing;
    const enrollment: Enrollment = {
      ...input,
      id: crypto.randomUUID(),
      consumed: 0,
      verifiedAt: new Date().toISOString(),
    };
    this.enrollments.set(key, enrollment);
    return enrollment;
  }

  async getEnrollment(providerId: string, action: string, nullifier: string) {
    return this.enrollments.get(this.key(providerId, action, nullifier)) ?? null;
  }

  async consumePromotion(enrollmentId: string) {
    if (this.locks.has(enrollmentId)) return false;
    this.locks.add(enrollmentId);
    try {
      const enrollment = [...this.enrollments.values()].find((item) => item.id === enrollmentId);
      if (!enrollment || enrollment.consumed >= enrollment.granted) return false;
      enrollment.consumed += 1;
      return true;
    } finally {
      this.locks.delete(enrollmentId);
    }
  }

  async createSession(enrollmentId: string, tokenHash: string, expiresAt: string) {
    this.sessions.set(tokenHash, { enrollmentId, expiresAt });
  }

  async resolveSession(tokenHash: string) {
    const session = this.sessions.get(tokenHash);
    if (!session || Date.parse(session.expiresAt) <= Date.now()) return null;
    return [...this.enrollments.values()].find((item) => item.id === session.enrollmentId) ?? null;
  }

  async createWorldChallenge(challenge: WorldChallenge) {
    this.challenges.set(challenge.signalHash.toLowerCase(), { ...challenge, consumed: false });
  }

  async consumeWorldChallenge(signalHash: string) {
    const challenge = this.challenges.get(signalHash.toLowerCase());
    if (!challenge || challenge.consumed || Date.parse(challenge.expiresAt) <= Date.now()) {
      return false;
    }
    challenge.consumed = true;
    return true;
  }

  async recordRun(run: AccessRun) {
    this.runs.set(run.id, run);
  }
  async updateRun(id: string, patch: Partial<AccessRun>) {
    const run = this.runs.get(id);
    if (run) this.runs.set(id, { ...run, ...patch });
  }
  async getRun(id: string) {
    return this.runs.get(id) ?? null;
  }
  async listRuns(providerId: string, limit = 25) {
    return [...this.runs.values()]
      .filter((run) => run.providerId === providerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }
}
