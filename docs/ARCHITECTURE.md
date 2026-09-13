# Alive402 architecture

```mermaid
flowchart TB
  classDef person fill:#E8F0FF,stroke:#146EF5,color:#0B2458,stroke-width:2px
  classDef world fill:#FFF1F4,stroke:#E05272,color:#64152A,stroke-width:2px
  classDef app fill:#E9FBF4,stroke:#10A779,color:#063D2E,stroke-width:2px
  classDef payment fill:#FFF5D9,stroke:#D99400,color:#4E3400,stroke-width:2px
  classDef data fill:#F1EEFF,stroke:#7C5CFC,color:#30216D,stroke-width:2px

  Human[Person in browser]:::person --> Gateway[Alive402 application]:::app
  Agent[Capped payment agent]:::person --> Gateway
  Gateway <--> World[World IDKit and<br/>Developer API]:::world
  Gateway <--> Store[(Supabase<br/>sessions, entitlements, receipts)]:::data
  Gateway <--> API[Protected OpenRouter<br/>inference endpoint]:::app
  Gateway <--> Facilitator[Blocky402<br/>x402 facilitator]:::payment
  Facilitator <--> Hedera[Hedera Testnet<br/>USDC HTS]:::payment
```

## Trust boundaries

- **Browser:** receives public IDKit configuration and a short-lived proof signal. It never receives World RP signing material, Supabase secret access, payer keys, or raw payment signatures.
- **Alive402 server:** creates signed World requests, verifies completed proofs, binds each proof to a one-time signal, consumes promotions atomically, and applies payment budget limits.
- **Supabase:** stores only server-side state: a scoped nullifier, hashed session token, hashed World proof signal, sanitized request evidence, and settlement reference. It stores no selfie image.
- **Blocky402 and Hedera:** determine whether a paid retry is valid and settle the configured amount to the configured merchant. Alive402 accepts only its configured testnet, asset, recipient, and maximum amount.

```mermaid
sequenceDiagram
  participant U as Human / browser
  participant W as World ID App
  participant A as Alive402 gateway
  participant D as Supabase
  participant C as x402 client agent
  participant B as Blocky402
  participant H as Hedera Testnet
  participant M as OpenRouter

  U->>A: Request signed RP context
  A-->>U: Signed action + nonce
  U->>W: Selfie Check through IDKit
  W-->>U: Scoped proof + nullifier
  U->>A: Complete IDKit result
  A->>W: Verify proof via Developer Portal
  A->>D: Grant one provider-scoped entitlement
  U->>A: First inference request
  A->>M: Execute upstream handler
  A->>D: Atomically consume entitlement
  A-->>U: Promotional response
  U->>A: Second inference request
  A-->>U: 402 + PAYMENT-REQUIRED
  U->>C: Let capped demo agent continue
  C->>A: Retry with PAYMENT-SIGNATURE
  A->>B: Verify signed Hedera transaction
  A->>M: Prepare protected response
  A->>B: Settle
  B->>H: Co-sign, pay fees, submit
  H-->>B: Confirm transaction
  B-->>A: Settlement receipt
  A-->>C: Answer + PAYMENT-RESPONSE
```

The World nullifier is scoped to the relying party and action. Alive402 uses one stable action per provider campaign, so changing browser, wallet, or email does not create another entitlement for that campaign. Selfie Check remains a medium-assurance anti-abuse signal, not a claim of global uniqueness.
