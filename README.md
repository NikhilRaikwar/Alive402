# Alive402

**One real trial. Then pay per call.**

Alive402 is a fair-trial gateway for AI APIs. The intended production flow grants one promotional request to a Selfie Check-verified enrollment. After that entitlement is consumed, the same endpoint returns HTTP `402 Payment Required`; a budgeted client pays through x402 on Hedera and retries the request.

This repository currently contains the responsive landing page and interactive product-flow prototype. World proof verification, persistent entitlement enforcement, and Blocky402 settlement are the next implementation milestones. The UI labels the current sequence as a prototype and must not be treated as transaction evidence.

## Why Alive402

Email addresses, wallets and cookies are weak free-trial boundaries. Alive402 is designed to let an existing API provider combine:

- World Selfie Check as a liveness and abuse-resistance eligibility signal;
- a one-use promotional entitlement enforced on the server;
- a real HTTP 402 challenge after the promotion is consumed;
- autonomous per-request payment settled on Hedera through Blocky402.

Selfie Check is a medium-assurance credential. Alive402 does not claim that it proves global uniqueness or guarantees one person can never create another account.

## Current UI

The landing page demonstrates the planned user journey:

1. Verify through World Selfie Check.
2. Consume one promotional API call.
3. Receive HTTP 402 on the next request.
4. Run a budgeted payment client.
5. Settle on Hedera and unlock the response.

The page also presents the planned `withAlive402` middleware interface for providers. The package shown in the code sample has not been published yet.

## Technology

- TanStack Start
- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Radix UI
- Lucide React

Planned integrations:

- World IDKit and Selfie Check Sandbox
- x402 resource server and client
- Blocky402 facilitator
- Hedera Testnet payment settlement
- persistent one-use entitlement store

## Run locally

Requirements:

- Node.js 22 or later
- npm 10 or later

```bash
git clone https://github.com/NikhilRaikwar/Alive402.git
cd Alive402
npm install
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

## Planned architecture

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

Qualification is only claimed after the corresponding integrations and public evidence are live.

## Documentation

The full product requirements document is maintained at [`docs/PRD.md`](docs/PRD.md). Before submission, the architecture diagram, World integration feedback and verified transaction evidence will also be added to this repository.

## License

Licensed under the [MIT License](LICENSE).
