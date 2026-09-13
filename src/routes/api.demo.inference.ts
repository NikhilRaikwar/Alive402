import { createFileRoute } from "@tanstack/react-router";
import { alive402, DEMO_PROVIDER, enrollmentFromRequest, store } from "@/server/alive402";
import { runInference } from "@/server/inference";
import { paymentRequiredResponse, settleVerifiedPayment, verifyPaymentHeader } from "@/server/x402";

export const Route = createFileRoute("/api/demo/inference")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const started = Date.now();
        const body = (await request
          .clone()
          .json()
          .catch(() => ({}))) as { prompt?: string };
        const prompt = body.prompt?.trim().slice(0, 1000);
        if (!prompt) return Response.json({ error: "A prompt is required" }, { status: 400 });
        const runId = crypto.randomUUID();
        const run = {
          id: runId,
          providerId: DEMO_PROVIDER,
          mode: "denied" as const,
          decision: "request_received",
          prompt,
          createdAt: new Date().toISOString(),
        };
        await store.recordRun(run);

        const paymentHeader = request.headers.get("payment-signature");
        if (paymentHeader) {
          try {
            const verifiedPayment = await verifyPaymentHeader(paymentHeader);
            const answer = await runInference(prompt);
            const payment = await settleVerifiedPayment(verifiedPayment);
            await store.updateRun(runId, {
              mode: "x402",
              decision: "settled",
              transaction: payment.settled.transaction,
              amount: "0.001 USDC",
            });
            return Response.json(
              {
                runId,
                answer,
                access: "x402",
                latencyMs: Date.now() - started,
                transaction: payment.settled.transaction,
                network: payment.settled.network,
              },
              {
                headers: {
                  "payment-response": payment.responseHeader,
                  "cache-control": "no-store",
                },
              },
            );
          } catch (error) {
            await store.updateRun(runId, { decision: "payment_failed" });
            return Response.json(
              { error: error instanceof Error ? error.message : "Payment failed", runId },
              { status: 402 },
            );
          }
        }

        const enrollment = await enrollmentFromRequest(request);
        if (!enrollment || enrollment.consumed >= enrollment.granted) {
          await store.updateRun(runId, { mode: "x402", decision: "payment_required" });
          const response = await safePaymentRequired();
          response.headers.set("x-alive402-run-id", runId);
          return response;
        }

        try {
          const answer = await runInference(prompt);
          const decision = await alive402.decideAccess(enrollment);
          if (decision.mode !== "promotion") {
            await store.updateRun(runId, { mode: "x402", decision: "payment_required" });
            const response = await safePaymentRequired(
              "The promotional call was consumed by another request",
            );
            response.headers.set("x-alive402-run-id", runId);
            return response;
          }
          await store.updateRun(runId, { mode: "promotion", decision: "promotion_consumed" });
          return Response.json(
            { runId, answer, access: "promotion", latencyMs: Date.now() - started },
            { headers: { "cache-control": "no-store" } },
          );
        } catch (error) {
          await store.updateRun(runId, { decision: "inference_failed" });
          return Response.json(
            { error: error instanceof Error ? error.message : "Inference failed", runId },
            { status: 502 },
          );
        }
      },
    },
  },
});

async function safePaymentRequired(message?: string) {
  try {
    return await paymentRequiredResponse(message);
  } catch (error) {
    return Response.json(
      {
        error: "PAYMENT_SERVICE_UNAVAILABLE",
        message: error instanceof Error ? error.message : "Hedera payment service is unavailable",
      },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
