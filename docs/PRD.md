# Alive402 — Product Requirements Document

**Event:** ETHOnline 2026  
**Build type:** Start Fresh  
**Primary prize targets:** World — Selfie Check; Hedera — AI & Agentic Payments  
**Product category:** Fair free trials and pay-per-use access for AI services  
**Working title replaced:** HumanTrial  
**Judge sentence:** **“Alive402 gives a selfie-verified enrollment one promotional AI call; after that, the same endpoint charges each request automatically through x402 on Hedera.”**

## 1. Product Decision

Build **Alive402**, a reusable access layer for AI APIs. A service provider wraps an inference endpoint with one policy:

```text
Selfie Check passed + promotional call unused → serve one call free
Otherwise → return HTTP 402 and accept automatic Hedera payment
```

The public demo is an AI explainer. A visitor completes World Selfie Check, receives one free answer, then makes a second request. The service returns a real HTTP `402 Payment Required` response. A funded client signs the payment, Blocky402 settles it on Hedera testnet, and the original request completes.

The project must also expose the mechanism as reusable middleware or a small SDK. This is essential to its novelty. A single paywalled chatbot would be too close to Hedera's existing x402 inference proof of concept.

## 2. Naming

### Selected name: Alive402

Why it works:

- `Alive` communicates the liveness credential without claiming strict global uniqueness.
- `402` communicates the protocol-level paid continuation.
- The name is short enough for a logo, repository, URL and spoken pitch.
- A judge can infer both halves of the demo before the explanation ends.

### Tagline

**Prove you’re live. Try once. Then pay per call.**

### Required language

Use these phrases:

- `selfie-verified enrollment`
- `liveness-verified trial`
- `promotional inference`
- `pay per call`
- `abuse resistance`

Do not claim:

- `one unique human worldwide`
- `Sybil-proof`
- `one person, one account`
- `proof of humanity`

World describes Selfie Check as a medium-assurance credential for liveness, facial similarity, abuse resistance and continuity. It adds friction to repeated account creation but does not guarantee one person has only one account.

## 3. The Problem

Free AI trials rely on email addresses, cookies, IP addresses and card checks. These controls are easy to automate around, exclude privacy-conscious users, or force a subscription before a person understands the product. Meanwhile, autonomous agents cannot naturally complete a conventional checkout or manage API keys and monthly plans.

Alive402 introduces a two-stage access primitive:

1. A real person can demonstrate liveness and sample a service once without payment.
2. Continued human or agent usage becomes a protocol-native, metered purchase with no subscription or API key.

The surprising transformation is:

> A selfie becomes a fair trial; the next HTTP request becomes a blockchain payment.

## 4. Why the Sponsor Technology Is Essential

### World is the eligibility layer

World Selfie Check determines whether the current enrollment can receive the promotional call. It is not a login badge. Without a valid proof, the free route is unavailable.

The app must:

- initiate the real IDKit Selfie Check flow;
- support the desktop QR handoff to the World ID Sandbox App;
- verify the returned proof on the backend;
- bind the verified result to an opaque enrollment identifier and demo session;
- consume the promotional entitlement exactly once;
- support a returning-user continuity path where available;
- clearly label sandbox credentials as test credentials.

### Hedera is the continuation and settlement layer

Hedera x402 is the only way to unlock a metered request after the promotion is consumed. The server must return a real HTTP 402 challenge and release the requested answer only after Blocky402 confirms onchain settlement.

The app must:

- host a live x402-gated inference endpoint;
- use Hedera testnet or mainnet;
- settle through the Blocky402 facilitator;
- complete at least one paid request end to end;
- use a funded programmatic client, not only a manual wallet checkout;
- show the transaction ID, payer, recipient, asset, amount and settlement status;
- charge per inference request rather than sell a flat plan.

## 5. Novelty Assessment

### Score before sharpening: 7/10

`Selfie → one free call → x402 payment` is clear and useful, but paid inference over Hedera x402 already has an official proof of concept. If Alive402 is submitted as only a chatbot, judges may view the payment half as a reskin.

### Score with this PRD: 9/10

The submission is a reusable **free-to-paid access policy for any HTTP service**, demonstrated through inference. The new primitive is the transition between human eligibility and agent-native metering:

```ts
alive402({
  promotion: { credential: "world-selfie-check", calls: 1 },
  continuation: { scheme: "x402", network: "hedera-testnet", price: "configured" }
})
```

This makes the sponsor combination load-bearing:

- Remove World and the fair promotional entitlement disappears.
- Remove Hedera x402 and automatic paid continuation disappears.
- Remove the middleware and the project becomes a one-off demo instead of infrastructure.

The final novelty still depends on real integrations and a clean demonstration. UI animation without proof verification and settlement does not qualify.

## 6. Target Users

### AI API provider

Wants to let real prospective users sample an expensive service while reducing automated trial farming and monetizing continued use without subscriptions.

### Human evaluator

Wants to try a model with low friction, understand the quota, and continue with a small transparent payment.

### Autonomous agent

Wants to call a service, interpret its price, enforce a spending limit, pay and receive the resource without an API key or manual checkout.

### Hackathon judge

Wants to see a working World proof, a literal HTTP 402 response, an autonomous payment and a verifiable Hedera transaction in under one minute.

## 7. Product Principles

### Show the boundary crossing

The hero is not the generated answer. The hero is the same endpoint changing from `free because eligible` to `payment required` to `paid and delivered`.

### Proof before polish

Every important UI state must expose the corresponding backend decision or external proof. Never fake verification, payment or settlement.

### One route, two access modes

The free and paid experiences must call the same protected resource route. Separate mock buttons weaken the story.

### Precise identity claims

Selfie Check is used as an abuse-resistance and eligibility signal. Product copy must not overstate its assurance.

### A stranger can test it

Provide a public live app, a funded judge-safe agent run, visible testnet evidence, and a recorded successful run for resilience.

## 7A. Company Integration Product

Alive402 must feel like infrastructure an existing company can connect to its current product, not a demo chatbot that the company must replace.

### Provider promise

> Add one liveness-verified trial and automatic pay-per-call access to an existing API in minutes.

### Integration methods

Ship one method fully and show the other as documented follow-up. For the deadline, prioritize the middleware because it is easiest to verify in source code.

#### Method 1 — TypeScript middleware (must ship)

The company installs the Alive402 package and wraps an existing route:

```ts
import { withAlive402 } from "@alive402/next";

export const POST = withAlive402(existingInferenceHandler, {
  world: {
    action: "acme-ai-trial",
    promotionalCalls: 1
  },
  payment: {
    network: "hedera-testnet",
    asset: process.env.PAYMENT_ASSET,
    price: process.env.PRICE_PER_CALL,
    recipient: process.env.HEDERA_RECIPIENT
  }
});
```

The wrapper performs eligibility lookup, atomic promotion consumption, 402 challenge generation, settlement verification and evidence emission before invoking the company's original handler.

#### Method 2 — reverse proxy (document and demo if time permits)

The company points Alive402 at an existing upstream endpoint:

```bash
npx alive402 protect \
  --upstream https://api.example.com/v1/generate \
  --world-action example-trial \
  --free-calls 1 \
  --price 0.01 \
  --network hedera-testnet
```

The proxy becomes the public endpoint. It forwards requests upstream only after a valid promotional entitlement or confirmed x402 settlement.

### Provider onboarding flow

The provider console must make the commercial product understandable without requiring judges to edit code:

1. Click `Add service`.
2. Enter service name and upstream URL.
3. Choose `One Selfie Check trial`.
4. Set price per request and Hedera recipient account.
5. Run a server-side connectivity test.
6. Copy the generated middleware/configuration.
7. Send a request from the built-in test console.
8. View promotion use, 402 challenge, payment and delivered response in one timeline.

For the public hackathon instance, upstream URL creation may be restricted to a safe allowlist to prevent server-side request forgery. Judges can use the preconfigured `Explain API` service and still inspect the generated integration.

### Integration proof

The repository must contain two separate applications or routes:

- `example-provider`: an ordinary inference endpoint with no World or payment knowledge;
- `alive402-gateway`: the wrapper that controls access and forwards approved requests.

During the technical demo, briefly show that the provider handler contains only its business logic. Then show Alive402 wrapping it. This proves a company can adopt the product without rebuilding its API.

### Future commercial model

After the hackathon, providers could use Alive402 as:

- open-source self-hosted middleware;
- hosted gateway with usage analytics;
- SDK for web apps, AI APIs, data feeds, OCR, translation and compute jobs;
- policy engine supporting different trial eligibility credentials and x402 settlement networks.

These are roadmap directions. The hackathon submission must ship one World policy and one Hedera payment path deeply.

## 8. Thirty-Second Demo

### 0–5 seconds

Open the playground. The top policy strip says:

```text
1 liveness-verified call free · then 0.01 USDC per call on Hedera
```

Presenter says:

> “Free AI trials are farmed with fake accounts. Alive402 gives a selfie-verified enrollment one sample, then machines pay per request.”

### 5–13 seconds

Click `Verify for one free call`. Scan the World Sandbox QR and complete Selfie Check. The UI changes live:

```text
World Selfie Check     VERIFIED
Promotional calls      1 available
```

### 13–19 seconds

Submit `Explain ERC-4626 in one sentence.` The answer appears. The entitlement counter animates from `1` to `0`, backed by a server response:

```json
{ "access": "promotion", "remaining": 0 }
```

### 19–25 seconds

Submit a second prompt. The network panel visibly shows:

```http
HTTP/1.1 402 Payment Required
network: hedera-testnet
price: 0.01 USDC
facilitator: Blocky402
```

The autonomous client reads the challenge, checks its configured budget and signs the payment.

### 25–30 seconds

The transaction confirms and the original answer unlocks. The UI shows:

```text
PAID → SETTLED → RESPONSE DELIVERED
Hedera transaction: 0.0.x@timestamp
```

Presenter ends:

> “World decides who may sample. Hedera lets any human or agent continue without an account, API key or subscription.”

## 9. Full Public User Journey

1. Visitor opens `/playground` and sees the live policy before connecting anything.
2. Visitor enters a prompt.
3. If no verified enrollment exists, the interface offers `Verify for one free call` or `Use paid agent`.
4. Verification opens the real IDKit flow. Desktop shows a QR; mobile uses a deep link.
5. Backend verifies the credential and creates an opaque entitlement record.
6. The UI displays one available promotional call.
7. First request reaches `POST /api/inference` with the verified session.
8. Policy engine atomically consumes the entitlement and calls the model.
9. Second request reaches the same endpoint.
10. Policy engine finds no remaining entitlement and returns a standards-compliant 402 challenge.
11. Agent client parses the price and network, verifies it is within budget, constructs/signs the payment payload and retries.
12. Resource server forwards settlement through Blocky402.
13. Only after confirmation does the server call the model and return the answer.
14. UI renders the answer and a proof drawer with World state, policy decision, raw 402 summary and Hedera evidence.
15. User can send another paid request, each producing a separate settlement.

## 10. Required Screens

### 10.1 Landing page

Keep the landing page shorter than two desktop viewports.

Above the fold:

- Alive402 logo;
- headline: `A fair free trial for humans. Pay-per-call for everyone.`;
- tagline: `Prove you’re live. Try once. Then pay per call.`;
- primary CTA: `Try the live service`;
- secondary CTA: `See how it works`;
- compact three-step visual: `Selfie Check → Free call → HTTP 402 + Hedera payment`;
- small `Built with World + Hedera` line.

Second section:

- one side-by-side before/after illustration;
- before: fake accounts farm free credits;
- after: verified trial plus metered continuation;
- one sentence explaining that Selfie Check adds liveness-based abuse resistance and is not a global uniqueness proof.

Final section:

- copyable middleware example;
- CTA to playground;
- GitHub link;
- no fake usage metrics, testimonials, customer logos or long protocol explanation.

### 10.2 Live playground

This is the main judging surface.

Header:

- current policy;
- World status;
- free calls remaining;
- agent wallet balance;
- Hedera network indicator.

Center:

- prompt composer;
- response card;
- primary contextual button: `Verify`, `Use free call`, or `Pay & run`;
- autonomous mode toggle enabled by default for the paid demo.

Right-side event rail:

```text
Request received
Eligibility checked
Promotion consumed / 402 issued
Payment signed
Blocky402 settlement confirmed
Resource delivered
```

Bottom proof drawer:

- World credential verification result with sensitive fields removed;
- access decision ID;
- raw response status and payment requirements;
- Hedera transaction link;
- asset, amount, payer and recipient;
- model response request ID and latency.

### 10.3 Provider console

Show that Alive402 is reusable infrastructure.

Provider can configure:

- protected endpoint name;
- free calls per verified enrollment, locked to `1` for the demo;
- price per call;
- accepted Hedera asset supported by the chosen Blocky402 flow;
- merchant recipient account;
- maximum agent spend per request;
- model/provider adapter.

Console also shows:

- promotional requests served;
- 402 challenges issued;
- paid requests settled;
- recent access decisions;
- recent transaction evidence;
- copyable integration snippet.

Configuration changes may be restricted to local admin credentials for the hackathon. Public judges do not need provider write access.

The console must also include a `Test integration` drawer that renders the exact request and response headers for:

1. an unverified request;
2. a verified promotional request;
3. an exhausted request returning 402;
4. a settled paid retry.

This drawer is the developer-facing proof that Alive402 controls a real HTTP endpoint.

### 10.4 Architecture modal/page

Show this exact architecture in a compact diagram:

```text
Browser / Autonomous Agent
        |
        v
Alive402 protected endpoint
        |
        +--> World IDKit + backend proof verification
        |         |
        |         +--> one-use entitlement store
        |
        +--> no entitlement: HTTP 402 challenge
                  |
                  v
            Agent payment client
                  |
                  v
       Blocky402 facilitator --> Hedera testnet
                  |
             settlement proof
                  |
                  v
        inference adapter --> response
```

## 11. Functional Requirements and Acceptance Criteria

### Epic A — World Selfie Check eligibility

#### Story A1: start verification

As a visitor, I can initiate Selfie Check from the playground.

Acceptance criteria:

- Uses IDKit and the configured World app/action.
- Desktop flow displays a scannable QR code.
- Mobile flow opens the World ID App through the appropriate handoff.
- UI handles pending, success, rejection, expiry and retry states.
- Sandbox mode is visibly labeled.

#### Story A2: verify proof server-side

As a provider, I only grant the promotion after backend verification.

Acceptance criteria:

- Proof is verified on the server, never trusted only from client state.
- The server stores an opaque derived enrollment key; raw selfie imagery is never stored.
- A failed, expired or replayed proof grants no entitlement.
- A successful proof creates at most one active promotional entitlement for that derived key and policy version.
- Logs exclude sensitive proof material.

#### Story A3: consume one entitlement atomically

As a provider, I prevent two parallel requests from spending the same free call.

Acceptance criteria:

- Entitlement consumption is an atomic database operation or transaction.
- Exactly one concurrent request receives `access=promotion`.
- Other concurrent requests receive 402.
- The consumed state survives refresh and server restart.

### Epic B — x402 gated inference on Hedera

#### Story B1: return a real challenge

As an unfunded or promotion-exhausted client, I receive payment instructions.

Acceptance criteria:

- `POST /api/inference` returns actual HTTP status `402` when payment is required.
- The challenge contains the configured network, asset, amount, recipient and facilitator-compatible payment data.
- No model inference occurs before eligibility or settlement.
- The browser evidence view renders sanitized challenge fields from the real response.

#### Story B2: autonomous payment

As an agent, I can decide whether to pay and retry without manual checkout.

Acceptance criteria:

- Agent has a dedicated funded Hedera testnet wallet/account.
- Agent reads the 402 response programmatically.
- Agent checks `price <= maxPricePerCall` and `dailySpend + price <= dailyBudget`.
- Agent refuses an over-budget challenge with a visible reason.
- For an accepted challenge, it creates/signs the required payload and retries the original request.

#### Story B3: settle through Blocky402

As a provider, I release the resource only after settlement confirmation.

Acceptance criteria:

- Blocky402 is the facilitator in the live path.
- At least one payment settles on Hedera testnet or mainnet.
- Payment goes to the configured provider account.
- Successful response includes or can resolve a Hedera transaction identifier.
- Duplicate payment payloads do not buy unlimited calls.
- A failed or unconfirmed payment returns no model output.

#### Story B4: meter each inference

As a provider, I earn per completed paid request.

Acceptance criteria:

- Every paid inference after the trial has its own paid access decision.
- The price displayed before signing equals the settled price.
- Provider console totals are derived from recorded decisions and transaction evidence.
- Demo uses the asset actually supported by the implemented Blocky402 flow; UI must never label another asset.

### Epic C — reusable provider middleware

#### Story C1: protect another endpoint

As a developer, I can wrap an HTTP handler with Alive402 policy.

Acceptance criteria:

- Repository exports a middleware/helper package or clearly isolated module.
- Model-specific code is behind an adapter.
- Policy configuration is environment- or code-driven.
- README includes a minimal integration example.
- A second sample endpoint such as `/api/translate` can be protected without duplicating the policy engine.

### Epic D — evidence and judge confidence

#### Story D1: inspect every critical transition

As a judge, I can distinguish live activity from frontend animation.

Acceptance criteria:

- Event rail is driven by backend events/responses.
- World verification status comes from backend verification.
- 402 status is captured from the actual protected route.
- Settlement entry contains a real testnet transaction link.
- Every run gets a correlation ID linking eligibility, request, payment and response.
- Seeded or recorded evidence is labeled `Recorded successful run`.

## 12. API Contract

Exact field names can adapt to the selected SDK, but these semantic contracts are required.

### `POST /api/world/challenge`

Creates the IDKit action/session challenge.

Response:

```json
{
  "verificationSessionId": "vs_...",
  "action": "alive402-trial",
  "environment": "sandbox"
}
```

### `POST /api/world/verify`

Verifies the returned World proof and issues a secure application session.

Response:

```json
{
  "verified": true,
  "assurance": "selfie-check-beta",
  "promotion": { "remaining": 1, "policyVersion": "trial-v1" }
}
```

### `GET /api/access/status`

Returns only safe session state.

```json
{
  "worldStatus": "verified",
  "promotionRemaining": 1,
  "paymentNetwork": "hedera-testnet",
  "priceDisplay": "configured live value"
}
```

### `POST /api/inference`

Request:

```json
{ "prompt": "Explain ERC-4626 in one sentence." }
```

Free response:

```json
{
  "answer": "...",
  "access": "promotion",
  "promotionRemaining": 0,
  "decisionId": "dec_..."
}
```

Unpaid response:

```http
HTTP/1.1 402 Payment Required
```

The body/headers must follow the implemented x402 Hedera scheme rather than an invented JSON format.

Paid response:

```json
{
  "answer": "...",
  "access": "x402",
  "decisionId": "dec_...",
  "payment": {
    "network": "hedera-testnet",
    "transactionId": "...",
    "asset": "...",
    "amount": "...",
    "status": "settled"
  }
}
```

### `POST /api/agent/run`

Judge-safe endpoint that starts the funded autonomous client for a supplied prompt. It must use the same `/api/inference` route and cannot bypass payment verification.

## 13. Data Model

### VerificationSession

- `id`
- `worldAction`
- `environment`
- `status`: `created | pending | verified | rejected | expired`
- `derivedEnrollmentKeyHash`
- `createdAt`
- `verifiedAt`

### PromotionEntitlement

- `id`
- `derivedEnrollmentKeyHash`
- `policyVersion`
- `grantedCalls`
- `consumedCalls`
- `status`: `available | consumed | revoked`
- `createdAt`
- `consumedAt`

Unique constraint:

```text
(derivedEnrollmentKeyHash, policyVersion)
```

### AccessDecision

- `id`
- `correlationId`
- `requestHash`
- `mode`: `promotion | x402 | denied`
- `reason`
- `price`
- `asset`
- `paymentTransactionId`
- `createdAt`

### PaymentAttempt

- `id`
- `correlationId`
- `payerAccount`
- `recipientAccount`
- `network`
- `asset`
- `amount`
- `facilitator`
- `status`: `challenged | signed | submitted | settled | failed`
- `transactionId`
- `createdAt`
- `settledAt`

Never store selfie images. Minimize storage of raw World proof payloads; retain only what is required to validate or audit the application decision safely.

## 14. State Machines

### Promotional path

```text
UNVERIFIED
→ VERIFYING
→ VERIFIED_WITH_1_CALL
→ FREE_CALL_IN_FLIGHT
→ PROMOTION_CONSUMED
```

Failed terminal branches:

```text
VERIFYING → REJECTED
VERIFYING → EXPIRED
```

### Paid request path

```text
REQUESTED
→ 402_CHALLENGED
→ BUDGET_APPROVED
→ PAYMENT_SIGNED
→ FACILITATOR_SUBMITTED
→ HEDERA_SETTLED
→ RESOURCE_DELIVERED
```

Failure branches:

```text
402_CHALLENGED → BUDGET_REJECTED
PAYMENT_SIGNED → PAYMENT_FAILED
FACILITATOR_SUBMITTED → SETTLEMENT_TIMEOUT
```

No output may transition to `RESOURCE_DELIVERED` from a paid path unless settlement has been verified.

## 15. Technical Architecture

Recommended fast-build stack:

- Next.js + TypeScript frontend/backend;
- Tailwind or existing project design system;
- World IDKit for Selfie Check;
- server-side World proof verification;
- official Hedera x402 inference PoC and Blocky402 flow as implementation reference;
- Hedera SDK or Agent Kit where the facilitator/client scheme requires it;
- a simple persistent database such as Postgres/Supabase or SQLite for the hackathon server;
- one model adapter using the available inference provider;
- server-sent events or polling for the visual event rail;
- deployment on a public HTTPS host.

### Required trust boundaries

- Browser cannot mark itself verified.
- Browser cannot increment promotional quota.
- Agent cannot self-report payment success.
- Resource server verifies the facilitator result before inference.
- Provider signing secrets and funded agent key remain server-side.
- Public demo agent has a strict per-call and total budget.

## 16. Edge Cases

The MVP must handle:

- Selfie Check feature flag unavailable;
- QR expires before completion;
- user rejects consent;
- proof verification fails;
- replay of the same proof;
- page refresh after successful verification;
- two tabs consume the free call simultaneously;
- inference provider fails after free entitlement consumption;
- second request correctly returns actual 402;
- payment asset or amount differs from UI configuration;
- agent balance is insufficient;
- price exceeds agent budget;
- Blocky402 verification fails;
- facilitator settles but response to server times out;
- duplicate retry after settlement;
- model request fails after payment settlement;
- Hedera explorer or RPC is slow during judging.

For a paid model failure after confirmed settlement, the MVP should retry the model once and then return a clear `paid but generation failed` state with the transaction proof. If refund support cannot be built safely, document this limitation instead of claiming a refund.

## 17. Demo Resilience

The judging flow needs three modes:

### Live public mode

Real World Sandbox verification and real Hedera testnet payment. This is the primary demo.

### Funded agent mode

One click starts a real paid request from a tightly budgeted server-side demo agent. This lets judges test x402 even if they do not have a funded Hedera account.

### Recorded successful run

Displays a previously completed run with its original correlation ID and real transaction evidence. It is only a fallback for external outages and must be visibly labeled. It cannot be presented as a fresh transaction.

Include a `Reset local demo view` action. Resetting UI state must not fabricate a new World entitlement or hide that a test credential has already consumed its promotion.

## 18. Track Qualification Matrix

### World — Selfie Check

| Requirement | Alive402 implementation | Proof shown |
|---|---|---|
| Meaningful Selfie Check use | Gates the only free promotional entitlement | Successful backend-verified Sandbox flow |
| Risk, eligibility, fairness, continuity or abuse prevention | Uses liveness as an eligibility and abuse-resistance signal | Policy decision and consumed entitlement |
| Working app | Public playground and provider console | Live URL and video |
| Feedback document | Dedicated `docs/world-feedback.md` | Public repository |

The World feedback document must cover:

- IDKit and Selfie Check integration flow;
- Developer Portal navigation, search and product discovery;
- feature enablement and access-gating experience;
- Sandbox hot, cold and semi-cold states attempted;
- QR/deep-link handoff;
- proof success, rejection, expiry and retry behavior;
- test-user and device constraints;
- confusing, missing, broken or difficult documentation;
- exact browser, OS and phone used for the tested path.

### Hedera — AI & Agentic Payments

| Requirement | Alive402 implementation | Proof shown |
|---|---|---|
| Live x402 service | `/api/inference` is genuinely gated | Raw 402 response |
| Hedera testnet/mainnet | Payment settles on Hedera | Explorer transaction |
| Blocky402 facilitator | Verification and settlement use Blocky402 | Facilitator response/log |
| Consuming platform or agent | Budgeted autonomous inference client | Live agent event rail |
| Real paid request E2E | Second call pays and unlocks output | Payment plus delivered answer |
| Public repo and README | Setup, architecture and payment flow | GitHub link |
| Video <=5 minutes | Concise live flow | Submission video |

Extra points intentionally pursued:

- pay-per-inference metering;
- agent decision logic based on price and budget;
- verifiable payment audit trail in the app.

Do not add A2A negotiation, ERC-8004/HCS-14, UCP directory, HTS custom fees or scheduled payments until the primary end-to-end path is reliable.

## 19. Submission Assets

Repository must include:

- working source code;
- `.env.example` without secrets;
- setup instructions;
- architecture diagram;
- exact live-demo steps;
- World feedback document;
- x402 payment-flow explanation;
- testnet account/transaction evidence;
- known limitations;
- security note for the funded demo wallet;
- acknowledgements for starter kits and pre-existing open-source code;
- declaration that project-specific code began during the hackathon.

Submission page must clearly target:

1. `World — Selfie Check`
2. `Hedera — AI & Agentic Payments on Hedera`

Do not submit to World AgentKit Continuity or Hedera Continuity because this is a new project.

## 20. Build Order for the Deadline

### P0 — must work before UI polish

1. Clone or inspect the official Hedera x402 inference PoC and complete one testnet payment from a script.
2. Stand up the live protected endpoint and confirm unpaid request returns real 402.
3. Confirm paid retry settles through Blocky402 and returns a model answer.
4. Integrate World IDKit Sandbox and verify proof server-side.
5. Create the persistent one-use entitlement and atomic consumption.
6. Join both paths in the same `/api/inference` route.
7. Show live states and transaction proof in the playground.

The first seven steps constitute the qualifying product. Do not delay them for multi-tenant authentication or a visually complex dashboard.

### P1 — finalist-quality presentation

8. Add the autonomous budget decision.
9. Add the provider console and reusable middleware example.
10. Add architecture view and correlation-ID evidence drawer.
11. Write README, World feedback and payment-flow docs.
12. Record a clean successful run and the 2–4 minute submission video.

### P2 — only if everything above is stable

13. Add a second protected sample endpoint.
14. Add signed receipts or HCS audit trail if time permits.
15. Improve returning-user continuity presentation.

## 21. Cut List

Do not build for this submission:

- a model marketplace;
- subscription plans;
- custom token issuance;
- provider revenue withdrawal dashboard;
- mobile app;
- social login;
- global uniqueness claims;
- facial image storage;
- World AgentKit continuity integration;
- multi-agent bargaining;
- generalized reputation;
- tokenomics;
- complex analytics;
- more than one production model adapter.

## 22. Definition of Done

The project is submission-ready only when all of these are true:

- A new browser session can start real World Selfie Check through IDKit.
- Backend validates the returned proof.
- Verified enrollment receives exactly one promotional call.
- A second call to the same endpoint returns actual HTTP 402.
- The autonomous client reads the challenge and applies a visible budget rule.
- A real payment settles through Blocky402 on Hedera testnet or mainnet.
- The paid request returns the requested model output only after confirmation.
- UI shows the World decision, quota transition, 402 challenge and Hedera transaction.
- A public tester can trigger the funded-agent path safely.
- Provider middleware is isolated and documented for reuse.
- Public repository, live app, architecture diagram, README, World feedback document and demo video exist.
- Product copy never overstates Selfie Check assurance.

## 23. Judge Evaluation

### What judges should understand immediately

> “A live person gets one sample. Continued requests pay themselves over HTTP.”

### What makes it memorable

- The free counter visibly reaches zero.
- The next request literally becomes an HTTP 402.
- An agent makes a real spending decision.
- A Hedera transaction unlocks the waiting answer.

### Why it resembles strong ETHGlobal finalists

It combines a familiar action with one visible, verifiable transformation:

```text
selfie verification
        ↓
one fair trial
        ↓
the next web request pays itself
```

The scope is narrow enough to ship, the sponsor tools enforce the core behavior, and the payoff happens during the live demo rather than in a future roadmap.

## 24. Risks and Honest Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Selfie Check access is not enabled | Cannot run live World flow | Request access immediately; implement full IDKit path; use Sandbox test credentials; keep recorded successful flow only as outage fallback |
| Claim sounds like unique-person proof | Credibility loss with World judges | Use liveness/enrollment language throughout UI and pitch |
| Project looks like existing paid-inference PoC | Novelty loss | Lead with reusable free-to-paid middleware and demonstrate provider console plus same-route transition |
| Blocky402/testnet latency | Demo stalls | Pre-fund agent, warm services, expose states, retain recorded run with real transaction |
| Free entitlement race | Trial can be double-spent | Atomic database update and concurrency test |
| Demo wallet drains | Public demo fails | Strict per-call price, total budget, rate limit and manual refill; never expose key |
| Inference fails after settlement | Poor user outcome | Retry once and display truthful paid-failure evidence; document refund limitation |

## 25. Official Sources Used

- World Selfie Check (Beta): https://docs.world.org/world-id/credentials/11
- World Sandbox testing: https://docs.world.org/world-id/sandbox/testing-selfie-check
- Hedera x402 overview and exact payment flow: https://hedera.com/blog/hedera-and-the-x402-payment-standard/
- Hedera x402 inference reference: https://github.com/hedera-dev/x402-inference-pay-per-request-poc
- Blocky402 facilitator: https://blocky402.com/
- x402 protocol: https://github.com/x402-foundation/x402
