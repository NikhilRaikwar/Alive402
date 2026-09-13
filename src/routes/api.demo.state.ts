import { createFileRoute } from "@tanstack/react-router";
import { enrollmentFromRequest } from "@/server/alive402";
import { integrationStatus } from "@/server/env";

export const Route = createFileRoute("/api/demo/state")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const enrollment = await enrollmentFromRequest(request);
        return Response.json(
          {
            configured: integrationStatus(),
            verified: Boolean(enrollment),
            remaining: enrollment ? Math.max(0, enrollment.granted - enrollment.consumed) : 0,
            used: enrollment?.consumed ?? 0,
            network: "hedera:testnet",
            price: "0.001 USDC",
          },
          { headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});
