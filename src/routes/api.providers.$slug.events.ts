import { createFileRoute } from "@tanstack/react-router";
import { store } from "@/server/alive402";

export const Route = createFileRoute("/api/providers/$slug/events")({
  server: {
    handlers: {
      GET: async ({ params }) =>
        Response.json(
          { events: await store.listRuns(params.slug, 30) },
          { headers: { "cache-control": "no-store" } },
        ),
    },
  },
});
