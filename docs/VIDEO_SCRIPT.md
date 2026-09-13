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

## 1:15–1:35 — Landing page and World request, live

Return briefly to the deployed landing page and point at the five-step product flow. Then open `/demo`, point out the healthy World, Hedera, and OpenRouter status indicators, and select **Verify for one free call**. Show the QR code.

Say: “This landing page shows the exact product contract: verify, one promotional request, HTTP 402, a capped agent payment, and the unlocked response. On desktop, Alive402 creates a signed World IDKit Selfie Check request and renders this QR code. The browser never receives our RP signing key.”

Say: “This Sandbox account still has an invitation pending for Selfie Check, so it cannot complete enrollment in this recording. The app correctly does not issue a promotional session. I’ll now show the live paid continuation the API serves after a trial is unavailable or consumed.”

## 1:35–2:05 — Literal HTTP 402, live

Close the QR dialog. In `/demo`, ask: **“Explain ERC-4626 in one sentence.”** and select **Send request**. Keep the red 402 card visible. Optionally show the terminal command and its literal headers:

```cmd
curl.exe -i -X POST https://alive402.vercel.app/api/demo/inference -H "Content-Type: application/json" --data "{\"prompt\":\"Explain ERC-4626 in one sentence.\"}"
```

Say: “Because this browser has no unused promotional entitlement, the protected endpoint returns a real HTTP 402. Here is the literal PAYMENT-REQUIRED header. It specifies Hedera Testnet, Circle test USDC, the configured merchant, and an exact price of 0.001 USDC.”

## 2:05–2:45 — Capped agent payment and retry, live

Back in `/demo`, select **Run capped agent · pay 0.001 USDC**. Show the payment state and unlocked answer.

Say: “The server-side agent accepts only this configured network, asset, receiver, and maximum amount. It signs the x402 payment, Blocky402 verifies and settles it on Hedera, and the agent retries the same request with PAYMENT-SIGNATURE. The answer is returned only after PAYMENT-RESPONSE.”

Open the HashScan link.

Say: “This is the Hedera Testnet settlement transaction for the paid API request.”

## 2:45–3:10 — Provider evidence

Open the execution receipt and `/dashboard`.

Say: “Providers receive a sanitized audit trail. The dashboard separates payment challenges, successful settled calls, and failures. This row links to the same HashScan-backed execution receipt.”

## 3:10–3:35 — Reusable builder value

Open `/builders` and show the generated middleware and `@nikhilraikwar/alive402-sdk` package name.

Say: “Alive402 is reusable infrastructure for AI inference, data APIs, and developer tools. A provider wraps an existing Fetch handler, chooses its promotional policy and payment requirement, and gets a fair trial followed by protocol-native agent payments.”

## 3:35–3:50 — Landing page closing

Return to the landing page and show the five-step flow once more.

Say: “Alive402 makes a trial fairer for people and makes the next request payable for agents. One API, one policy layer, and direct settlement on Hedera.”

## Judge checklist

- World Selfie Check QR request is visible; any unavailable Sandbox enrollment is described truthfully.
- The protected request visibly returns HTTP 402 and PAYMENT-REQUIRED.
- The capped agent’s exact Hedera payment and the unlocked response are visible.
- HashScan transaction, execution receipt, dashboard, and SDK integration are visible.
- The video stays below four minutes at normal speed.
