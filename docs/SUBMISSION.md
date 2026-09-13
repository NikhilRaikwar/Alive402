# Alive402 — ETHGlobal submission kit

Replace bracketed links before submitting. Do not claim a live URL or video until it exists.

## Project name

Alive402

## Tagline

One real AI trial. Then agents pay per call.

## Short description

Alive402 is a fair-trial gateway for AI APIs. A World Selfie Check-verified person receives one promotional inference call. Every later request returns HTTP 402; a capped agent pays 0.001 USDC through Blocky402 on Hedera Testnet and retries the same request.

## Long description

Free trials are easy to abuse because users can reset email addresses, wallets, and cookies. Alive402 makes the trial boundary a real liveness and continuity signal: a person completes World Selfie Check, the server verifies the proof, and the provider issues one atomic promotional entitlement keyed to its campaign.

After that call is consumed, Alive402 does not redirect to a subscription page. The exact same API returns a standards-based x402 payment challenge. Our agent reads the requirement, checks its strict recipient/token/amount limits, signs a Hedera payment, settles through Blocky402, retries the request, and receives the unlocked OpenRouter inference response.

Alive402 is built as reusable infrastructure for existing AI, data, and developer-tool APIs. The original API handler remains ordinary application code; `packages/sdk` supplies World enrollment, fair-trial policy, and access decision primitives.

## What we built

- Functional World Selfie Check flow with server-side RP signing and backend proof verification.
- Five-minute one-time proof signal and provider-scoped nullifier deduplication.
- Atomic Supabase entitlement consumption and opaque server session.
- OpenRouter-backed inference endpoint protected by real x402 v2 HTTP 402 challenges.
- Capped autonomous payer using USDC `0.0.429274` on Hedera Testnet through Blocky402.
- Public execution receipt, HashScan link, merchant dashboard, builder integration route, and TypeScript SDK.

## Sponsor mapping

### World — Selfie Check

Selfie Check is central to the product: it is the eligibility and abuse-resistance signal that creates the one-call trial. Alive402 uses the current `selfieCheckLegacy()` preset, verifies the complete result through World’s backend API, and stores only the campaign-scoped nullifier—not selfie images. We accurately present it as a medium-assurance liveness and continuity signal, not global uniqueness.

### Hedera — AI & Agentic Payments

Alive402 runs a live x402-gated inference service and a client that discovers its 402 challenge, pays for it in USDC on Hedera Testnet, and retries successfully. Blocky402 settles the transaction. Real proof: [`0.0.7162784@1789301497.214020816`](https://hashscan.io/testnet/transaction/0.0.7162784%401789301497.214020816).

## Built with

World IDKit, World Selfie Check, Supabase Postgres, x402 v2, `@x402/hedera`, `@x402/fetch`, Blocky402, Hedera Testnet, Circle test USDC, OpenRouter, TanStack Start, React, TypeScript, and Tailwind CSS.

## Links to add

- Live demo: `[LIVE_DEMO_URL]`
- Demo video: `[VIDEO_URL]`
- GitHub: `https://github.com/NikhilRaikwar/Alive402`
- Real settlement: `https://hashscan.io/testnet/transaction/0.0.7162784%401789301497.214020816`

## Submission checklist

- [ ] Public GitHub repository and MIT license
- [ ] Live deployed `/demo` URL
- [ ] Two-to-three minute recording following [DEMO_RUNBOOK.md](DEMO_RUNBOOK.md)
- [ ] Architecture diagram in README
- [ ] World feedback document included
- [ ] HashScan settlement link included
- [ ] Track selection: **World — Selfie Check** and **Hedera — AI & Agentic Payments**
