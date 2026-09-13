# Deploy Alive402

## 1. Create the database

Create or select a Supabase project, open **SQL Editor**, paste
[`supabase/migrations/001_alive402.sql`](../supabase/migrations/001_alive402.sql), and run it once.

The migration creates the provider, campaign, enrollment, opaque session, access-run, and payment tables. Row Level Security is enabled on every table. Browser roles have no table or function access; the application uses a server-only secret key.

In **Project Settings → API**, copy:

- Project URL → `SUPABASE_URL`
- Secret key (`sb_secret_...`) → `SUPABASE_SECRET_KEY`

The legacy `service_role` key is accepted as `SUPABASE_SERVICE_ROLE_KEY`, but a new secret key is preferred. Never prefix either variable with `VITE_` and never expose it in browser code.

## 2. Configure World

In the World Developer Portal, configure the deployed Alive402 domain and Selfie Check Sandbox. Add:

- `WORLD_APP_ID`
- `WORLD_RP_ID`
- `WORLD_RP_SIGNING_KEY`
- `WORLD_ENVIRONMENT=staging` while using Sandbox; switch to `production` only for the production World configuration

The RP signing key is a server secret. The action remains fixed in code as `alive402-demo-v1`.

## 3. Configure Hedera and Blocky402

Create two ECDSA Hedera testnet accounts. Associate testnet USDC token `0.0.429274` with both accounts and fund the payer with test USDC.

- Payer account ID → `HEDERA_AGENT_ACCOUNT_ID`
- Payer ECDSA private key → `HEDERA_AGENT_PRIVATE_KEY`
- Receiver account ID → `HEDERA_SERVICE_ACCOUNT_ID`
- Receiver ECDSA private key → `HEDERA_SERVICE_PRIVATE_KEY` (needed only for one-time USDC association)
- `BLOCKY402_FACILITATOR_URL=https://api.testnet.blocky402.com`
- `DEMO_DAILY_PAYMENT_LIMIT=40` (lower this for a public demo budget)

The private key belongs only in `.env.local` and Vercel Environment Variables. Never place it in a `VITE_` variable, commit it, paste it into the builder UI, or send it to the browser.

## 4. Configure inference

- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL=openai/gpt-4o-mini`

## 5. Local run

Copy `.env.example` to `.env.local`, replace every placeholder, then run:

```bash
npm install
npm run dev
```

## 6. Vercel

Import the GitHub repository into Vercel. Add every variable above for Production and Preview, plus:

```text
PUBLIC_APP_URL=https://your-alive402-domain.vercel.app
```

Deploy, then verify `/api/demo/state` reports all integrations as configured. Run the complete flow from `/demo` and save the returned HashScan and `/proof/:runId` links as submission evidence.
