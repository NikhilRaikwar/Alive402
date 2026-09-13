# Alive402

**One real trial. Then pay per call.**

Alive402 is a fair-trial gateway for AI APIs. The intended production flow grants one promotional request to a Selfie Check-verified enrollment. After that entitlement is consumed, the same endpoint returns HTTP `402 Payment Required`; a budgeted client pays through x402 on Hedera and retries the request.

This repository contains a working full-stack implementation: World IDKit enrollment, persistent one-use entitlements, an x402 v2 Hedera resource server, a capped autonomous payment client, OpenRouter inference, execution receipts, provider dashboard, and reusable TypeScript SDK.

## Why Alive402

Email addresses, wallets and cookies are weak free-trial boundaries. Alive402 is designed to let an existing API provider combine:

- World Selfie Check as a liveness and abuse-resistance eligibility signal;
- a one-use promotional entitlement enforced on the server;
- a real HTTP 402 challenge after the promotion is consumed;
- autonomous per-request payment settled on Hedera through Blocky402.

Selfie Check is a medium-assurance credential. Alive402 does not claim that it proves global uniqueness or guarantees one person can never create another account.

## Sixty-second demo

Open `/demo` and complete this journey:

1. Verify through World Selfie Check.
2. Consume one promotional API call.
3. Receive HTTP 402 on the next request.
4. Run a budgeted payment client.
5. Settle on Hedera and unlock the response.

Every displayed verification, entitlement, 402 challenge and transaction comes from server state. When required environment values are missing, the UI says the corresponding integration is unconfigured instead of fabricating success.

## Technology

- TanStack Start
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Radix UI
- Lucide React

- World IDKit and Selfie Check Sandbox
- x402 v2 resource server and autonomous client
- Blocky402 facilitator on Hedera Testnet
- Supabase Postgres with atomic entitlement consumption
- OpenRouter-compatible AI inference

## Run locally

Requirements:

- Node.js 22 or later
- npm 10 or later

```bash
git clone https://github.com/NikhilRaikwar/Alive402.git
cd Alive402
npm install
npm run typecheck
npm run dev
```

Then open the local URL printed by Vite.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run format
```

Copy `.env.example` to `.env.local`, supply the World, Supabase, Hedera and OpenRouter values, and run [`supabase/migrations/001_alive402.sql`](supabase/migrations/001_alive402.sql) in the Supabase SQL editor.

## Architecture

```text
Browser or autonomous client
            |
            v
     Alive402 middleware
       /             \
World proof       HTTP 402 challenge
verification             |
       |                  v
one-use trial       x402 payment client
entitlement               |
                          v
                 Blocky402 facilitator
                          |
                          v
                    Hedera Testnet
                          |
                          v
                  protected AI API
```

## Hackathon targets

Alive402 is being built from scratch for ETHOnline 2026 and targets:

- **World — Selfie Check:** meaningful use for trial eligibility and abuse resistance, with a working Sandbox flow and required feedback document.
- **Hedera — AI & Agentic Payments:** a live x402-gated service settled through Blocky402, plus a client that completes a real paid request end to end.

The app exposes the literal `PAYMENT-REQUIRED`, `PAYMENT-SIGNATURE`, and `PAYMENT-RESPONSE` exchange. A successful paid run links to its Hedera Testnet transaction on HashScan.

## Documentation

The full product requirements document is at [`docs/PRD.md`](docs/PRD.md). See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md), [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/WORLD_FEEDBACK.md`](docs/WORLD_FEEDBACK.md), and [`docs/X402_PAYMENT_FLOW.md`](docs/X402_PAYMENT_FLOW.md) for setup and judge-facing evidence.

## License

Licensed under the [MIT License](LICENSE).
