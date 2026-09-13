# Hedera x402 payment flow

Alive402 implements x402 v2 `exact` payments through the official `@x402/core`, `@x402/hedera`, and `@x402/fetch` packages.

- Network: `hedera:testnet`
- Asset: Circle testnet USDC, HTS token `0.0.429274`
- Amount: `1000` atomic units (`0.001 USDC`)
- Facilitator: `https://api.testnet.blocky402.com`
- Recipient: configured by `HEDERA_SERVICE_ACCOUNT_ID`

The resource server first returns status 402 with a base64 x402 declaration in `PAYMENT-REQUIRED`. The capped demo client accepts only the configured network, asset, recipient, and maximum atomic amount. It constructs a partially signed Hedera transaction and retries with `PAYMENT-SIGNATURE`.

Alive402 asks Blocky402 to verify the payment before invoking the protected operation. After the response is ready, Blocky402 co-signs, pays the network fee, submits the transfer, and returns a settlement receipt. Alive402 exposes that receipt in `PAYMENT-RESPONSE` and stores the transaction ID for a public HashScan link.

Private keys and raw payment signatures are never returned by the public receipt API.
