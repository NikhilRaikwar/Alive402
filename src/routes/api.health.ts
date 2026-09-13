import { createFileRoute } from "@tanstack/react-router";
import { publicIntegrationStatus } from "@/server/env";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: () =>
        Response.json(publicIntegrationStatus(), {
          headers: { "cache-control": "no-store" },
        }),
    },
  },
});
