import { signRequest } from "@worldcoin/idkit-core/signing";
import { hashSignal } from "@worldcoin/idkit-core";
import type { IDKitResult } from "@worldcoin/idkit-core";
import type { AccessMode, Alive402Config, Enrollment } from "./types.ts";

export * from "./types.ts";
export * from "./memory-store.ts";
export * from "./middleware.ts";
export * from "./client.ts";

export function nullifierHexToDecimal(value: string): string {
  if (!/^0x[0-9a-fA-F]{1,64}$/.test(value)) throw new Error("Invalid World nullifier");
  return BigInt(value).toString(10);
}

export function createAlive402(config: Alive402Config) {
  if (!config.payment.payTo || config.payment.amount === "0") {
    throw new Error("Alive402 payment configuration is incomplete");
  }

  return {
    config,
    createRpSignature() {
      return signRequest({ signingKeyHex: config.world.signingKey, action: config.world.action });
    },
    async verifyEnrollment(
      result: IDKitResult,
    ): Promise<{ enrollment: Enrollment; alreadyClaimed: boolean }> {
      if (!("action" in result) || result.action !== config.world.action)
        throw new Error("World action mismatch");
      const response = await fetch(
        `https://developer.world.org/api/v4/verify/${config.world.rpId}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(result),
        },
      );
      if (!response.ok) throw new Error("World proof verification failed");
      const proof = result.responses.find((item) => "nullifier" in item);
      if (!proof || !("nullifier" in proof)) throw new Error("World proof has no nullifier");
      if (!("signal_hash" in proof) || !proof.signal_hash)
        throw new Error("World proof is missing its request signal");
      const signalHash = String(proof.signal_hash).toLowerCase();
      if (!(await config.trial.store.consumeWorldChallenge(signalHash)))
        throw new Error("World proof request expired or was already used");
      const nullifier = nullifierHexToDecimal(String(proof.nullifier));
      const existing = await config.trial.store.getEnrollment(
        config.providerId,
        config.world.action,
        nullifier,
      );
      if (existing)
        return { enrollment: existing, alreadyClaimed: existing.consumed >= existing.granted };
      const enrollment = await config.trial.store.grant({
        providerId: config.providerId,
        action: config.world.action,
        nullifier,
        granted: config.trial.calls,
      });
      return { enrollment, alreadyClaimed: false };
    },
    async createWorldChallenge(signal: string) {
      const signalHash = hashSignal(signal).toLowerCase();
      await config.trial.store.createWorldChallenge({
        signalHash,
        expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
      });
      return signalHash;
    },
    async decideAccess(
      enrollment: Enrollment | null,
    ): Promise<{ mode: AccessMode; enrollment: Enrollment | null }> {
      if (!enrollment) return { mode: "x402", enrollment: null };
      const consumed = await config.trial.store.consumePromotion(enrollment.id);
      return { mode: consumed ? "promotion" : "x402", enrollment };
    },
    protect(handler: (request: Request) => Promise<Response>) {
      return async (request: Request, enrollment: Enrollment | null) => {
        const decision = await this.decideAccess(enrollment);
        if (decision.mode === "promotion") return handler(request);
        return new Response(JSON.stringify({ error: "PAYMENT_REQUIRED" }), { status: 402 });
      };
    },
  };
}

/**
 * Server-only World enrollment helper. It deliberately excludes session-cookie
 * handling because every framework owns cookies differently; callers persist
 * the returned enrollment and resolve it on protected requests.
 */
export function createWorldEnrollment(input: {
  providerId: string;
  appId: string;
  rpId: string;
  signingKey: string;
  action: string;
  calls: number;
  store: Alive402Config["trial"]["store"];
}) {
  const alive402 = createAlive402({
    providerId: input.providerId,
    world: {
      appId: input.appId,
      rpId: input.rpId,
      signingKey: input.signingKey,
      action: input.action,
    },
    trial: { calls: input.calls, store: input.store },
    // Enrollment does not use payment configuration. A structurally complete
    // placeholder keeps the core policy construction in one audited path.
    payment: {
      network: "hedera:testnet",
      facilitatorUrl: "https://api.testnet.blocky402.com",
      asset: "0.0.429274",
      amount: "1",
      payTo: "enrollment-only",
    },
  });
  return {
    createRpSignature: alive402.createRpSignature,
    createWorldChallenge: alive402.createWorldChallenge,
    verifyEnrollment: alive402.verifyEnrollment,
  };
}
