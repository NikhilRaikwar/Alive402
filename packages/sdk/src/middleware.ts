import { HTTPFacilitatorClient, x402ResourceServer } from "@x402/core/server";
import {
  decodePaymentSignatureHeader,
  encodePaymentRequiredHeader,
  encodePaymentResponseHeader,
} from "@x402/core/http";
import { ExactHederaScheme } from "@x402/hedera/exact/server";
import type { WithAlive402Options } from "./types.ts";

const USDC_DECIMALS = 6;

export function withAlive402(
  handler: (request: Request) => Promise<Response> | Response,
  options: WithAlive402Options,
) {
  let serverPromise: Promise<x402ResourceServer> | undefined;
  const getServer = () => {
    serverPromise ??= (async () => {
      const server = new x402ResourceServer(
        new HTTPFacilitatorClient({ url: options.payment.facilitatorUrl }),
      ).register(
        "hedera:*",
        new ExactHederaScheme({
          defaultAssets: {
            [options.payment.network]: { asset: options.payment.asset, decimals: USDC_DECIMALS },
          },
        }),
      );
      await server.initialize();
      if (!server.hasRegisteredScheme(options.payment.network, "exact")) {
        throw new Error("Hedera exact scheme failed to register");
      }
      return server;
    })();
    return serverPromise;
  };

  const requirements = async () => {
    const server = await getServer();
    const accepts = await server.buildPaymentRequirements({
      scheme: "exact",
      network: options.payment.network,
      price: { asset: options.payment.asset, amount: options.payment.amount },
      payTo: options.payment.payTo,
      maxTimeoutSeconds: 90,
    });
    if (!accepts.length) throw new Error("No Hedera payment requirements were created");
    return { server, accepts };
  };

  return async (request: Request): Promise<Response> => {
    const paymentSignature = request.headers.get("payment-signature");
    if (paymentSignature) {
      try {
        const { server, accepts } = await requirements();
        const payload = decodePaymentSignatureHeader(paymentSignature);
        const matched = server.findMatchingRequirements(accepts, payload);
        if (
          !matched ||
          matched.network !== options.payment.network ||
          matched.asset !== options.payment.asset ||
          matched.amount !== options.payment.amount ||
          matched.payTo !== options.payment.payTo
        ) {
          throw new Error("Payment does not match this provider's requirement");
        }
        const verification = await server.verifyPayment(payload, matched);
        if (!verification.isValid) throw new Error(verification.invalidMessage || "Payment verification failed");
        const response = await handler(request);
        const settlement = await server.settlePayment(payload, matched);
        if (!settlement.success) throw new Error(settlement.errorMessage || "Payment settlement failed");
        await options.onAccessRun?.({
          mode: "x402",
          decision: "settled",
          transaction: settlement.transaction,
          amount: options.payment.amount,
        });
        const headers = new Headers(response.headers);
        headers.set("payment-response", encodePaymentResponseHeader(settlement));
        return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
      } catch (error) {
        await options.onAccessRun?.({ mode: "x402", decision: "payment_failed" });
        return paymentRequired(options, error instanceof Error ? error.message : "Payment failed");
      }
    }

    const enrollment = await options.world.resolveEnrollment(request);
    if (enrollment && enrollment.consumed < enrollment.granted) {
      const used = await options.trial.store.consumePromotion(enrollment.id);
      if (used) {
        await options.onAccessRun?.({ mode: "promotion", decision: "promotion_consumed" });
        return handler(request);
      }
    }
    await options.onAccessRun?.({ mode: "x402", decision: "payment_required" });
    return paymentRequired(options, "A promotional call is unavailable or already used");
  };
}

async function paymentRequired(options: WithAlive402Options, message: string) {
  try {
    const server = new x402ResourceServer(
      new HTTPFacilitatorClient({ url: options.payment.facilitatorUrl }),
    ).register(
      "hedera:*",
      new ExactHederaScheme({
        defaultAssets: {
          [options.payment.network]: { asset: options.payment.asset, decimals: USDC_DECIMALS },
        },
      }),
    );
    await server.initialize();
    const accepts = await server.buildPaymentRequirements({
      scheme: "exact",
      network: options.payment.network,
      price: { asset: options.payment.asset, amount: options.payment.amount },
      payTo: options.payment.payTo,
      maxTimeoutSeconds: 90,
    });
    const payload = await server.createPaymentRequiredResponse(
      accepts,
      options.resource ?? {
        url: "",
        description: "Alive402 protected resource",
        serviceName: "Alive402",
        mimeType: "application/json",
      },
      message,
    );
    return new Response(JSON.stringify({ error: "PAYMENT_REQUIRED", message }), {
      status: 402,
      headers: { "content-type": "application/json", "payment-required": encodePaymentRequiredHeader(payload) },
    });
  } catch (error) {
    return Response.json(
      { error: "PAYMENT_SERVICE_UNAVAILABLE", message: error instanceof Error ? error.message : "Payment unavailable" },
      { status: 503 },
    );
  }
}
