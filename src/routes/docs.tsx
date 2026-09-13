import { createFileRoute } from "@tanstack/react-router";
import { PageIntro, PageShell } from "@/components/app-shell";

export const Route = createFileRoute("/docs")({ component: DocsPage });

const sections = [
  [
    "1. Verify the enrollment",
    "Alive402 generates the RP signature on your server. IDKit requests selfieCheckLegacy(), then your backend forwards the complete proof to World’s v4 verification endpoint and stores the scoped nullifier.",
  ],
  [
    "2. Grant one promotional call",
    "The SDK atomically consumes the provider campaign entitlement. A new email, wallet, or browser does not recreate it because the policy is keyed by the World nullifier and action.",
  ],
  [
    "3. Return HTTP 402",
    "After the entitlement is consumed, the protected endpoint returns PAYMENT-REQUIRED with an x402 v2 exact requirement for USDC on hedera:testnet.",
  ],
  [
    "4. Verify and settle",
    "The client signs PAYMENT-SIGNATURE. Blocky402 verifies the partially signed transaction, pays the network fee, settles on Hedera, and the API returns PAYMENT-RESPONSE.",
  ],
] as const;
function DocsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <PageIntro
          eyebrow="Documentation"
          title="A fair trial in four steps."
          copy="Alive402 is a small policy and payment layer for existing HTTP APIs. The upstream handler remains ordinary application code."
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-[180px_1fr]">
          <aside className="text-sm">
            <p className="font-semibold">On this page</p>
            <div className="mt-3 space-y-2 text-muted-foreground">
              <p>Architecture</p>
              <p>Environment</p>
              <p>HTTP contract</p>
              <p>Security</p>
            </div>
          </aside>
          <article className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold">Architecture</h2>
              <div className="mt-5 space-y-4">
                {sections.map(([title, copy]) => (
                  <div key={title} className="border-l-2 border-primary pl-5">
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold">Required environment</h2>
              <Code
                text={`WORLD_APP_ID=app_...\nWORLD_RP_ID=rp_...\nWORLD_RP_SIGNING_KEY=...\nSUPABASE_URL=https://...supabase.co\nSUPABASE_SERVICE_ROLE_KEY=...\nHEDERA_AGENT_ACCOUNT_ID=0.0...\nHEDERA_AGENT_PRIVATE_KEY=0x...\nHEDERA_SERVICE_ACCOUNT_ID=0.0...\nOPENROUTER_API_KEY=...\nPUBLIC_APP_URL=https://alive402.vercel.app`}
              />
            </section>
            <section>
              <h2 className="text-2xl font-bold">Canonical HTTP exchange</h2>
              <Code
                text={`POST /api/demo/inference\n→ 402 Payment Required\nPAYMENT-REQUIRED: <base64 x402 v2 declaration>\n\nPOST /api/demo/inference\nPAYMENT-SIGNATURE: <partially signed Hedera transaction>\n→ 200 OK\nPAYMENT-RESPONSE: <Blocky402 settlement receipt>`}
              />
            </section>
            <section>
              <h2 className="text-2xl font-bold">Security decisions</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                <li>Selfie images and raw proof payloads are never persisted.</li>
                <li>Nullifiers are normalized as decimal 256-bit values.</li>
                <li>Signing and payer keys remain server-only.</li>
                <li>
                  The demo client accepts only the configured token, receiver and maximum amount.
                </li>
                <li>
                  Selfie Check is described as medium-assurance abuse resistance, not strict
                  personhood.
                </li>
              </ul>
            </section>
          </article>
        </div>
      </div>
    </PageShell>
  );
}
function Code({ text }: { text: string }) {
  return (
    <pre className="mt-5 overflow-x-auto rounded-xl bg-code p-5 font-mono text-[13px] leading-6 text-slate-200">
      <code>{text}</code>
    </pre>
  );
}
