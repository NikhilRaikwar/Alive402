import { createFileRoute } from "@tanstack/react-router";
import { alive402 } from "@/server/alive402";
import { env } from "@/server/env";

export const Route = createFileRoute("/api/world/sign")({
  server: {
    handlers: {
      POST: async () => {
        if (!env.worldSigningKey)
          return Response.json({ error: "World Selfie Check is not configured" }, { status: 503 });
        const signed = alive402.createRpSignature();
        return Response.json({
          ...signed,
          app_id: env.worldAppId,
          rp_id: env.worldRpId,
          action: alive402.config.world.action,
          environment: env.worldEnvironment,
        });
      },
    },
  },
});
