# Alive402 judge demo runbook

## The promise in one sentence

Alive402 gives a live person one fair AI trial, then lets an agent pay for every later API call with USDC on Hedera.

## Prepare before recording

1. Deploy the app and verify the public `/demo` route.
2. Confirm all four status dots are healthy: World, Supabase, Hedera, and OpenRouter.
3. Fund the capped payer with test USDC `0.0.429274`; associate both payer and merchant with that token.
4. Keep the real settlement receipt open as a fallback: [`0.0.7162784@1789301497.214020816`](https://hashscan.io/testnet/transaction/0.0.7162784%401789301497.214020816).
5. Use a fresh browser profile for the World trial demonstration. Use a second profile only after the first trial has been consumed to demonstrate the duplicate-enrollment protection.

## Live demo: 2 minutes 30 seconds

### 0:00–0:15 — problem and product

Show the landing page. Say: “AI providers want to offer a free trial, but email, wallets, and cookies are trivial to reset. Alive402 is a middleware layer: one live person gets one call, then agents pay per request.”

### 0:15–0:45 — World proof becomes a real entitlement

Open `/demo`, point out the live integration status, and click **Verify for one free call**. Complete the World Sandbox Selfie Check. Return to the product and show `World enrollment verified` and `1 of 1 calls remaining`.

Say: “The app sends the complete World proof to the World backend, deduplicates the provider-scoped nullifier, and only then issues a session. We do not store the selfie image.”

### 0:45–1:05 — one promotional call

Ask the protected AI endpoint a simple question. Show the real response and the step changing to consumed.

Say: “The promotion is atomically consumed in Supabase, so two parallel requests cannot spend the same last call.”

### 1:05–1:30 — literal HTTP 402

Send the same or another prompt again. Keep the 402 card visible. Point at `PAYMENT-REQUIRED received from /api/demo/inference`, price, testnet, and Blocky402.

Say: “This is not a paywall mock. The endpoint literally returns HTTP 402 and an x402 exact-payment requirement for Circle test USDC on Hedera.”

### 1:30–2:00 — agent settles and retries

Click **Run capped agent · pay 0.001 USDC**. Let the agent pay and retry. Show the answer, `PAYMENT-RESPONSE verified`, and the HashScan link.

Say: “The agent accepts only our configured network, USDC token, merchant, and cap. Blocky402 verifies the partially signed transaction, settles it on Hedera, and the original request is retried.”

### 2:00–2:20 — proof for providers

Open the execution receipt and then `/dashboard`. Show that the request is recorded as `settled` with the same transaction reference.

Say: “This is what a provider sees: fair trials, literal payment challenges, and sanitized audit evidence—not a new dashboard users need to learn.”

### 2:20–2:30 — close

Say: “Alive402 is a reusable trial-to-pay gateway. People get a fair sample; autonomous clients get API access without an account, subscription, or API key.”

## Backup recording plan

Record a successful run before submission. If World Sandbox availability or a testnet RPC fails during judging, use the recording, then show the live dashboard, stored execution receipt, and HashScan transaction. Never describe a prerecorded run as live.

## Exact judge checklist

- World Sandbox Selfie Check is visible.
- First protected request is free and server-backed.
- Second protected request visibly returns HTTP 402.
- `PAYMENT-REQUIRED`, `PAYMENT-SIGNATURE`, and `PAYMENT-RESPONSE` are explained.
- A real `0.001 USDC` Hedera Testnet payment is shown on HashScan.
- The final inference answer appears only after settlement.
