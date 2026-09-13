import { createAlive402, MemoryAlive402Store } from "@nikhilraikwar/alive402-sdk";
import { env } from "./env";
import { SupabaseAlive402Store } from "./supabase-store";
import { readCookie, sha256 } from "./crypto";

const globalStore = globalThis as typeof globalThis & { __alive402Store?: MemoryAlive402Store };
const memoryStore = globalStore.__alive402Store ?? new MemoryAlive402Store();
globalStore.__alive402Store = memoryStore;

export const store =
  env.supabaseUrl && env.supabaseServiceKey
    ? new SupabaseAlive402Store(env.supabaseUrl, env.supabaseServiceKey)
    : memoryStore;

export const DEMO_PROVIDER = "alive402-demo";
export const WORLD_ACTION = "alive402-demo-v1";

export const alive402 = createAlive402({
  providerId: DEMO_PROVIDER,
  world: {
    appId: env.worldAppId,
    rpId: env.worldRpId,
    signingKey: env.worldSigningKey,
    action: WORLD_ACTION,
  },
  trial: { calls: 1, store },
  payment: {
    network: "hedera:testnet",
    facilitatorUrl: env.facilitatorUrl,
    asset: "0.0.429274",
    amount: "1000",
    payTo: env.hederaReceiverId || "0.0.0",
  },
});

export async function enrollmentFromRequest(request: Request) {
  const token = readCookie(request, "alive402_session");
  return token ? store.resolveSession(await sha256(token)) : null;
}
