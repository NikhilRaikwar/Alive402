import { HTTPFacilitatorClient, x402ResourceServer } from "@x402/core/server";
import {
  decodePaymentSignatureHeader,
  encodePaymentRequiredHeader,
  encodePaymentResponseHeader,
} from "@x402/core/http";
import { ExactHederaScheme as HederaServerScheme } from "@x402/hedera/exact/server";
import { ExactHederaScheme as HederaClientScheme } from "@x402/hedera/exact/client";
import { createClientHederaSigner, PrivateKey } from "@x402/hedera";
import { x402Client } from "@x402/core/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { env } from "./env";
import { createHederaPaidFetch } from "@nikhilraikwar/alive402-sdk";

const resourceInfo = {
  url: "/api/demo/inference",
  description: "Alive402 pay-per-call AI inference",
  mimeType: "application/json",
  serviceName: "Alive402 Demo Research Assistant",
};

let serverPromise: Promise<x402ResourceServer> | undefined;

async function getServer() {
  if (!env.hederaReceiverId) throw new Error("HEDERA_SERVICE_ACCOUNT_ID is not configured");
  serverPromise ??= (async () => {
    const server = new x402ResourceServer(
      new HTTPFacilitatorClient({ url: env.facilitatorUrl }),
    ).register(
      "hedera:*",
      new HederaServerScheme({
        defaultAssets: { "hedera:testnet": { asset: "0.0.429274", decimals: 6 } },
      }),
    );
    await server.initialize();
    if (!server.hasRegisteredScheme("hedera:testnet", "exact")) {
      throw new Error("Hedera exact scheme failed to register");
    }
    return server;
  })();
  return serverPromise;
}

export async function paymentRequirements() {
  const server = await getServer();
  const requirements = await server.buildPaymentRequirements({
    scheme: "exact",
    network: "hedera:testnet",
    price: { asset: "0.0.429274", amount: "1000" },
    payTo: env.hederaReceiverId,
    maxTimeoutSeconds: 90,
  });
  if (requirements.length === 0)
    throw new Error("Blocky402 returned no Hedera payment requirements");
  return { server, requirements };
}

export async function paymentRequiredResponse(
  error = "A promotional call is unavailable or already used",
) {
  const { server, requirements } = await paymentRequirements();
  const payload = await server.createPaymentRequiredResponse(requirements, resourceInfo, error);
  return new Response(
    JSON.stringify({
      error: "PAYMENT_REQUIRED",
      message: error,
      payment: {
        network: "hedera:testnet",
        asset: "0.0.429274",
        amount: "1000",
        displayAmount: "0.001 USDC",
      },
    }),
    {
      status: 402,
      headers: {
        "content-type": "application/json",
        "payment-required": encodePaymentRequiredHeader(payload),
        "cache-control": "private, no-store",
      },
    },
  );
}

export async function verifyPaymentHeader(paymentHeader: string) {
  const { server, requirements } = await paymentRequirements();
  const payload = decodePaymentSignatureHeader(paymentHeader);
  const matched = server.findMatchingRequirements(requirements, payload);
  if (!matched) throw new Error("Payment does not match the advertised Hedera requirement");
  if (
    matched.amount !== "1000" ||
    matched.asset !== "0.0.429274" ||
    matched.payTo !== env.hederaReceiverId
  ) {
    throw new Error("Payment amount, asset, or recipient mismatch");
  }
  const verified = await server.verifyPayment(payload, matched);
  if (!verified.isValid)
    throw new Error(
      verified.invalidMessage || verified.invalidReason || "Payment verification failed",
    );
  return { server, payload, matched };
}

export async function settleVerifiedPayment(
  verified: Awaited<ReturnType<typeof verifyPaymentHeader>>,
) {
  const settled = await verified.server.settlePayment(verified.payload, verified.matched);
  if (!settled.success)
    throw new Error(settled.errorMessage || settled.errorReason || "Payment settlement failed");
  return { settled, responseHeader: encodePaymentResponseHeader(settled) };
}

export async function createPaidFetch() {
  if (!env.hederaPayerId || !env.hederaPayerKey)
    throw new Error("Demo agent Hedera credentials are not configured");
  return createHederaPaidFetch({
    accountId: env.hederaPayerId,
    privateKey: env.hederaPayerKey,
    payment: {
      network: "hedera:testnet",
      facilitatorUrl: env.facilitatorUrl,
      asset: "0.0.429274",
      amount: "1000",
      payTo: env.hederaReceiverId,
    },
  });
}
