# Alive402 Node agent example

Provide a funded, USDC-associated Hedera Testnet ECDSA account only through server environment variables. Use `createHederaPaidFetch()` from `@nikhilraikwar/alive402-sdk` with an exact receiver, asset, and maximum amount.

The client first requests the protected endpoint. On a matching 402 requirement it signs once, retries automatically, and returns the settled response.
