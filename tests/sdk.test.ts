import test from "node:test";
import assert from "node:assert/strict";
import {
  createAlive402,
  MemoryAlive402Store,
  nullifierHexToDecimal,
} from "../packages/sdk/src/index.ts";

test("normalizes a World nullifier to an unsigned decimal integer", () => {
  assert.equal(nullifierHexToDecimal("0xFF"), "255");
  assert.throws(() => nullifierHexToDecimal("255"));
});

test("atomically allows one promotional call", async () => {
  const store = new MemoryAlive402Store();
  const enrollment = await store.grant({
    providerId: "demo",
    action: "trial-v1",
    nullifier: "10",
    granted: 1,
  });
  const results = await Promise.all([
    store.consumePromotion(enrollment.id),
    store.consumePromotion(enrollment.id),
  ]);
  assert.equal(results.filter(Boolean).length, 1);
});

test("an enrollment becomes x402 after its promotion", async () => {
  const store = new MemoryAlive402Store();
  const enrollment = await store.grant({
    providerId: "demo",
    action: "trial-v1",
    nullifier: "11",
    granted: 1,
  });
  const alive402 = createAlive402({
    providerId: "demo",
    world: { appId: "app_x", rpId: "rp_x", signingKey: "00", action: "trial-v1" },
    trial: { calls: 1, store },
    payment: {
      network: "hedera:testnet",
      facilitatorUrl: "https://example.com",
      asset: "0.0.429274",
      amount: "1000",
      payTo: "0.0.1",
    },
  });
  assert.equal((await alive402.decideAccess(enrollment)).mode, "promotion");
  assert.equal((await alive402.decideAccess(enrollment)).mode, "x402");
});
