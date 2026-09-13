import { createFileRoute } from "@tanstack/react-router";
import type { IDKitResult } from "@worldcoin/idkit-core";
import { alive402, store } from "@/server/alive402";
import { randomToken, sessionCookie, sha256 } from "@/server/crypto";

export const Route = createFileRoute("/api/world/verify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const result = (await request.json()) as IDKitResult;
          const verified = await alive402.verifyEnrollment(result);
          const token = randomToken();
          await store.createSession(
            verified.enrollment.id,
            await sha256(token),
            new Date(Date.now() + 86_400_000).toISOString(),
          );
          return Response.json(
            {
              verified: true,
              alreadyClaimed: verified.alreadyClaimed,
              remaining: Math.max(0, verified.enrollment.granted - verified.enrollment.consumed),
            },
            { headers: { "set-cookie": sessionCookie(token), "cache-control": "no-store" } },
          );
        } catch (error) {
          return Response.json(
            { error: error instanceof Error ? error.message : "Verification failed" },
            { status: 400 },
          );
        }
      },
    },
  },
});
