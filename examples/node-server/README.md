# Alive402 Node server example

Install `@alive402/sdk`, create a persistent `Alive402Store`, implement World enrollment routes, then wrap an ordinary Fetch handler with `withAlive402()` as shown in [SDK.md](../../docs/SDK.md).

Expected behavior: the first verified enrollment call reaches your handler. Later calls return `402` and `PAYMENT-REQUIRED`; a valid Hedera x402 retry returns your handler response with `PAYMENT-RESPONSE`.
