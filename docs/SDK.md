# Alive402 SDK

Install the Node SDK:

```bash
npm install @alive402/sdk
```

`withAlive402()` wraps a Fetch-compatible API handler. Your server supplies a persistent `Alive402Store` and resolves a previously World-verified enrollment from its HTTP-only session.

```ts
import { withAlive402 } from "@alive402/sdk";

export const POST = withAlive402(existingHandler, {
  providerId: "acme-ai",
  world: { action: "alive402-acme-ai-trial-v1", resolveEnrollment },
  trial: { freeCalls: 1, store },
  payment: {
    network: "hedera:testnet",
    facilitatorUrl: "https://api.testnet.blocky402.com",
    asset: "0.0.429274",
    amount: "1000",
    payTo: "0.0.1234567",
  },
});
```

For an autonomous Node client, use `createHederaPaidFetch()`. It only pays a matching Hedera requirement whose asset, receiver, and amount stay inside its configured policy.

```ts
import { createHederaPaidFetch } from "@alive402/sdk";
const paidFetch = createHederaPaidFetch({ accountId, privateKey, payment });
const response = await paidFetch("https://api.example.com/research", { method: "POST" });
```

`curl` and Python can inspect an ordinary `402` response and `PAYMENT-REQUIRED` header, but cannot create a Hedera payment signature without a compatible x402 signer.
