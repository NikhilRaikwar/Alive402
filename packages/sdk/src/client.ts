import { x402Client } from "@x402/core/client";
import { wrapFetchWithPayment } from "@x402/fetch";
import { createClientHederaSigner, PrivateKey } from "@x402/hedera";
import { ExactHederaScheme } from "@x402/hedera/exact/client";
import type { Alive402PaymentConfig } from "./types.ts";

export function createHederaPaidFetch(input: {
  accountId: string;
  privateKey: string;
  payment: Alive402PaymentConfig;
}) {
  const signer = createClientHederaSigner(
    input.accountId,
    PrivateKey.fromStringECDSA(input.privateKey),
    { network: input.payment.network },
  );
  const client = new x402Client()
    .register("hedera:*", new ExactHederaScheme(signer))
    .setSpendControls({
      allowedAssets: [
        {
          network: input.payment.network,
          asset: input.payment.asset,
          maxAmountPerPayment: input.payment.amount,
        },
      ],
    })
    .registerPolicy((_version, requirements) =>
      requirements.filter(
        (requirement) =>
          requirement.network === input.payment.network &&
          requirement.asset === input.payment.asset &&
          requirement.payTo === input.payment.payTo &&
          BigInt(requirement.amount) <= BigInt(input.payment.amount),
      ),
    );
  return wrapFetchWithPayment(fetch, client);
}
