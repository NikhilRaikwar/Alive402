import fs from "node:fs";
import { AccountId, Client, PrivateKey, TokenAssociateTransaction } from "@hiero-ledger/sdk";

const values = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.trim().startsWith("#"))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1)];
    }),
);

const receiverId = values.HEDERA_SERVICE_ACCOUNT_ID;
const receiverKey = values.HEDERA_SERVICE_PRIVATE_KEY;
if (!/^0\.0\.\d+$/.test(receiverId ?? "") || !receiverKey) {
  throw new Error("Set HEDERA_SERVICE_ACCOUNT_ID and HEDERA_SERVICE_PRIVATE_KEY in .env.local");
}

const client = Client.forTestnet();
const key = PrivateKey.fromStringECDSA(receiverKey);
client.setOperator(AccountId.fromString(receiverId), key);

try {
  const response = await new TokenAssociateTransaction()
    .setAccountId(receiverId)
    .setTokenIds(["0.0.429274"])
    .execute(client);
  const receipt = await response.getReceipt(client);
  console.log(`Associated 0.0.429274 with ${receiverId}: ${receipt.status}`);
  console.log(`Transaction: ${response.transactionId}`);
} finally {
  client.close();
}
