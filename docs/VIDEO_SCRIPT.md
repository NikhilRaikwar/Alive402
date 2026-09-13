# Alive402 demo video — 3 minutes 30 seconds

Record at normal speed. Keep the camera or screen visible during the World App handoff and do not cut together separate actions as if they were one live flow.

## 0:00–0:25 — The problem and product

Show the Alive402 landing page.

Say: “Free AI trials are easy to farm with new emails, browsers, and wallet addresses. Alive402 turns one live human verification into one promotional API call. After that, the same API becomes pay per call for humans and agents.”

## 0:25–1:10 — World Selfie Check

Open `/demo`. Point out the World, Hedera, and OpenRouter status indicators. Select **Verify for one free call**.

Say: “Alive402 requests World Selfie Check. On desktop, World gives us a QR code. I scan it with the World App and complete the live selfie flow on my phone.”

Scan the QR code and complete the real World Sandbox flow. Return to the desktop only after it completes.

Say: “The browser does not decide this result. Our server generated the signed RP context and one-time signal, World verifies the proof, and Alive402 stores the scoped nullifier as a privacy-preserving continuity signal. We store no selfie images and do not claim global uniqueness.”

## 1:10–1:40 — Promotional call

Ask “Explain ERC-4626 in simple terms.” Select **Send request**.

Say: “This is the one promotional inference call. The entitlement is consumed atomically, so parallel requests cannot both spend the last free call.”

Show the successful response and the `Promotional call` state.

## 1:40–2:25 — Literal 402 and agent payment

Send the same request again.

Say: “The same endpoint now responds with a real HTTP 402 and canonical PAYMENT-REQUIRED details: Hedera Testnet, test USDC, exact amount, and merchant recipient.”

Select **Run capped agent · pay 0.001 USDC**.

Say: “Our Node agent reads the requirement and pays only when the network, USDC asset, receiver, and amount match its policy. Blocky402 verifies and settles the payment, then the agent retries the original request with PAYMENT-SIGNATURE.”

Show `PAYMENT-RESPONSE verified`, then open the HashScan link.

## 2:25–2:55 — Evidence dashboard

Open `/dashboard`.

Say: “The provider console is backed by Supabase, not demo counters. It separates promotional calls, payment challenges, settled payments, and failed payments. Each row links to a sanitized execution receipt.”

Open the settled receipt and point out the transaction ID and network.

## 2:55–3:30 — Builder value and prize fit

Open `/builders` and show the generated Node middleware. Then open the SDK documentation.

Say: “Alive402 is reusable middleware for any Fetch-compatible API. Builders add a fair trial, World enrollment, and a real x402 paid continuation without changing their existing handler. This is our World Selfie Check use case for fairness and trial-abuse resistance, and our Hedera use case is a live x402-gated inference service with a real paid agent request through Blocky402.”

## Before recording

- Run `npm run typecheck`, `npm test`, and `npm run build`.
- Verify [health](https://alive402.vercel.app/api/health) reports all integrations configured.
- Confirm the demo payer has Hedera Testnet USDC.
- Complete one World Selfie Check on the deployed domain before recording.
- Keep the recording below four minutes and do not speed it up.
