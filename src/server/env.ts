const read = (name: string) => process.env[name]?.trim() ?? "";

export const env = {
  worldAppId: read("WORLD_APP_ID"),
  worldRpId: read("WORLD_RP_ID"),
  worldSigningKey: read("WORLD_RP_SIGNING_KEY"),
  worldEnvironment: read("WORLD_ENVIRONMENT") || "production",
  supabaseUrl: read("SUPABASE_URL"),
  supabaseServiceKey: read("SUPABASE_SECRET_KEY") || read("SUPABASE_SERVICE_ROLE_KEY"),
  hederaPayerId: read("HEDERA_AGENT_ACCOUNT_ID"),
  hederaPayerKey: read("HEDERA_AGENT_PRIVATE_KEY"),
  hederaReceiverId: read("HEDERA_SERVICE_ACCOUNT_ID"),
  facilitatorUrl: read("BLOCKY402_FACILITATOR_URL") || "https://api.testnet.blocky402.com",
  openRouterKey: read("OPENROUTER_API_KEY"),
  openRouterModel: read("OPENROUTER_MODEL") || "openai/gpt-4o-mini",
  publicUrl: read("PUBLIC_APP_URL") || "http://localhost:3000",
  demoDailyLimit: Number(read("DEMO_DAILY_PAYMENT_LIMIT") || "40"),
};

export function integrationStatus() {
  return {
    world: Boolean(env.worldAppId && env.worldRpId && env.worldSigningKey),
    database: Boolean(env.supabaseUrl && env.supabaseServiceKey),
    hedera: Boolean(env.hederaPayerId && env.hederaPayerKey && env.hederaReceiverId),
    inference: Boolean(env.openRouterKey),
  };
}
