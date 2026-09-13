# Alive402 architecture

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

The World nullifier is scoped to the relying party and action. Alive402 uses one stable action per provider campaign, so changing browser, wallet, or email does not create another entitlement for that campaign.
