import { createFileRoute } from "@tanstack/react-router";
import { store } from "@/server/alive402";

export const Route = createFileRoute("/api/runs/$runId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const run = await store.getRun(params.runId);
        return run
          ? Response.json(run)
          : Response.json({ error: "Run not found" }, { status: 404 });
      },
    },
  },
});
