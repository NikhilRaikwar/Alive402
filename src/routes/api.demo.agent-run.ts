import { createFileRoute } from "@tanstack/react-router";
import { createPaidFetch } from "@/server/x402";
import { env } from "@/server/env";

const globalLimits = globalThis as typeof globalThis & {
  __alive402AgentRuns?: Map<string, number>;
};
const runs = globalLimits.__alive402AgentRuns ?? new Map<string, number>();
globalLimits.__alive402AgentRuns = runs;

export const Route = createFileRoute("/api/demo/agent-run")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const day = new Date().toISOString().slice(0, 10);
          const used = runs.get(day) ?? 0;
          if (used >= env.demoDailyLimit)
            return Response.json(
              { error: "Demo agent daily spend limit reached" },
              { status: 429 },
            );
          const body = (await request.json()) as { prompt?: string };
          if (!body.prompt?.trim())
            return Response.json({ error: "A prompt is required" }, { status: 400 });
          const paidFetch = await createPaidFetch();
          const url = new URL("/api/demo/inference", request.url).toString();
          const response = await paidFetch(url, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ prompt: body.prompt.slice(0, 1000) }),
          });
          const payload = await response.json();
          if (!response.ok) return Response.json(payload, { status: response.status });
          runs.set(day, used + 1);
          return Response.json({
            ...payload,
            paymentResponse: response.headers.get("payment-response"),
          });
        } catch (error) {
          return Response.json(
            { error: error instanceof Error ? error.message : "Agent payment failed" },
            { status: 502 },
          );
        }
      },
    },
  },
});
