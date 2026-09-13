# Alive402 demo video — 3 minutes 45 seconds

Record at normal speed. Use the four slides only to establish the problem and architecture, then spend most of the recording on the deployed working product. Do not cut separate successful actions together as if they were one live run.

## Before recording

- Update the solution slide: replace **“Selfie proves unique human”** with **“Selfie Check confirms a live person”**. World Selfie Check is a medium-assurance liveness and continuity signal, not strict global uniqueness.
- Keep the deployed demo, World App, and HashScan ready.
- Confirm [health](https://alive402.vercel.app/api/health) reports World, Supabase, Hedera, and inference configured.
- Use a fresh browser profile for the promotional call. Keep the recording below four minutes without speed-up.

## 0:00–0:12 — Title slide

Show the **“Try once. Then the request pays.”** slide.

Say: “Alive402 gives a live person one fair AI trial. After that, the same API becomes pay per call for autonomous agents, using x402 and USDC on Hedera.”

## 0:12–0:35 — Problem slide

Show the **“Free trials were built for accounts”** slide.

Say: “Today, free trials are attached to resettable accounts. New emails, wallets, browsers, and cookies make one-person trial limits weak. At the same time, agents encounter subscription pages, API keys, and manual checkout flows even when they are ready to pay for one request.”

## 0:35–0:55 — Solution slide

Show the five-step **“Verify once. Try once. Then the request pays.”** slide.

Say: “Alive402 connects these two problems. World Selfie Check creates one privacy-preserving promotional enrollment for a provider campaign. The first request is free. The next request receives a standard HTTP 402 payment requirement. A capped agent pays exactly 0.001 test USDC on Hedera, retries, and receives the same API response.”

## 0:55–1:15 — Architecture slide

Show the gateway architecture slide.

Say: “The browser never receives signing or payer keys. Our server creates the World RP context, verifies the completed proof with World, and stores only a scoped nullifier and entitlement in Supabase. The protected OpenRouter endpoint uses x402. Blocky402 verifies and settles the Hedera payment, and our agent accepts only the configured network, USDC asset, receiver, and amount.”

## 1:15–1:55 — World Selfie Check, live

Open the deployed `/demo` route. Point out the integration status and select **Verify for one free call**. Show the QR code, scan it with the World App, and complete the actual Selfie Check.

Say: “Now I’ll show the real flow. On desktop, Alive402 opens World IDKit. I scan the QR code in the World App and complete Selfie Check. The completed proof returns here, our backend verifies it, and the app creates one promotional session. We do not store selfie images, and we do not claim strict global uniqueness.”

## 1:55–2:15 — Free request, live

Ask: **“Explain ERC-4626 in simple terms.”** Send the request and show the response.

Say: “This first protected inference request is the one promotional call. Its entitlement is consumed atomically, so two parallel requests cannot both take the last free call.”

## 2:15–2:55 — HTTP 402 and paid retry, live

Send the same request again. Keep the HTTP 402 card visible, then select **Run capped agent · pay 0.001 USDC**. Show the settlement state and unlocked answer.

Say: “The same endpoint now returns an actual HTTP 402 with the canonical PAYMENT-REQUIRED header. The requirement is Hedera Testnet, Circle test USDC, the configured merchant, and 0.001 USDC. Our server-side agent checks that policy, signs the payment, Blocky402 settles it, and the agent retries with PAYMENT-SIGNATURE. The API returns the answer only after PAYMENT-RESPONSE.”

Open the HashScan link.

Say: “This is the Hedera Testnet transaction for the paid request.”

## 2:55–3:25 — Provider evidence

Open the execution receipt and `/dashboard`.

Say: “Providers get a sanitized audit trail: promotional calls, payment challenges, settled calls, failures, and the HashScan-linked receipt. The dashboard is populated from Supabase events, rather than static counters.”

## 3:25–3:45 — Reusable builder value and close

Open `/builders` and show the SDK middleware, then the package name.

Say: “Alive402 is reusable infrastructure for AI inference, data APIs, and developer tools. A provider wraps an existing Fetch handler with `@nikhilraikwar/alive402-sdk`, chooses its campaign and price, and gets a fair trial followed by protocol-native agent payments. That is Alive402: one fair trial for people, and direct pay-per-call access for agents.”

## Judge checklist

- World Selfie Check QR and completion are visible.
- First protected request is free.
- Second request visibly returns HTTP 402 and PAYMENT-REQUIRED.
- The capped agent’s exact Hedera payment and the unlocked response are visible.
- HashScan transaction, execution receipt, dashboard, and SDK integration are visible.
- The video stays below four minutes at normal speed.
