# Alive402 SDK

`@nikhilraikwar/alive402-sdk` adds a fair trial followed by a standards-based Hedera x402 payment path to a Fetch-compatible HTTP API.

Alive402 is for providers that want a World Selfie Check-verified person to receive a small promotional entitlement, then let a compatible agent pay per request. Selfie Check is a medium-assurance liveness, continuity, and trial-abuse-resistance signal; it is not a claim of global uniqueness.

## Install

```bash
npm install @nikhilraikwar/alive402-sdk
```

Node.js 20 or newer is required.

## Protect an existing Fetch handler

Your application owns World enrollment and its server-side session. Pass `resolveEnrollment` so the SDK can find the already verified enrollment for the incoming request.

```ts
import { withAlive402 } from "@nikhilraikwar/alive402-sdk";
import { store, resolveEnrollment } from "./alive402-server.js";

const existingHandler = async () =>
  Response.json({ answer: "Protected API response" });

export const POST = withAlive402(existingHandler, {
  providerId: "acme-ai",
  world: {
    action: "alive402-acme-ai-trial-v1",
    resolveEnrollment,
  },
  trial: { freeCalls: 1, store },
  payment: {
    network: "hedera:testnet",
    asset: "0.0.429274",
    amount: "1000",
    payTo: "0.0.1234567",
    facilitatorUrl: "https://api.testnet.blocky402.com",
  },
});
```

The middleware atomically consumes a valid promotional entitlement. Once exhausted, it returns HTTP `402` with `PAYMENT-REQUIRED`. A valid `PAYMENT-SIGNATURE` is settled through the configured facilitator and the successful retry returns `PAYMENT-RESPONSE`.

## Pay from a Node agent

```ts
import { createHederaPaidFetch } from "@nikhilraikwar/alive402-sdk";

const paidFetch = createHederaPaidFetch({
  accountId: process.env.HEDERA_ACCOUNT_ID!,
  privateKey: process.env.HEDERA_PRIVATE_KEY!,
  payment: {
    network: "hedera:testnet",
    asset: "0.0.429274",
    payTo: "0.0.1234567",
    maxAmount: "1000",
  },
});

const response = await paidFetch("https://api.example.com/inference", {
  method: "POST",
  body: JSON.stringify({ prompt: "Explain ERC-4626." }),
});
```

The agent only pays a requirement that matches its network, asset, recipient, and maximum amount policy. Keep payer keys server-side and use a dedicated funded testnet account with a strict spending budget.

## World enrollment helpers

`createAlive402()` and `createWorldEnrollment()` provide server-side helpers for signed RP context creation, one-time signals, backend proof verification, scoped nullifier normalization, and session/entitlement creation. Never expose the RP signing key, World proof, nullifier, or session token to browser code.

## Documentation and examples

- [Full integration guide](https://github.com/NikhilRaikwar/Alive402/blob/main/docs/SDK.md)
- [Node server example](https://github.com/NikhilRaikwar/Alive402/tree/main/examples/node-server)
- [Node agent example](https://github.com/NikhilRaikwar/Alive402/tree/main/examples/node-agent)
- [Live reference implementation](https://alive402.vercel.app/)

## License

MIT. See the [repository license](https://github.com/NikhilRaikwar/Alive402/blob/main/LICENSE).
