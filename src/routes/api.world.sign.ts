import { createFileRoute } from "@tanstack/react-router";
import { alive402 } from "@/server/alive402";
import { env } from "@/server/env";
import { randomToken } from "@/server/crypto";

export const Route = createFileRoute("/api/world/sign")({
  server: {
    handlers: {
      POST: async () => {
        if (!env.worldSigningKey)
          return Response.json({ error: "World Selfie Check is not configured" }, { status: 503 });
        const signal = randomToken();
        await alive402.createWorldChallenge(signal);
        const signed = alive402.createRpSignature();
        return Response.json({
          sig: signed.sig,
          nonce: signed.nonce,
          // IDKit's RpContext uses snake_case. `signRequest` returns camelCase.
          created_at: signed.createdAt,
          expires_at: signed.expiresAt,
          app_id: env.worldAppId,
          rp_id: env.worldRpId,
          action: alive402.config.world.action,
          environment: env.worldEnvironment,
          signal,
        });
      },
    },
  },
});
