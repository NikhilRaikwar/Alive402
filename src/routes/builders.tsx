import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, ShieldCheck, Terminal, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { PageIntro, PageShell } from "@/components/app-shell";

export const Route = createFileRoute("/builders")({ component: BuildersPage });

function BuildersPage() {
  const [company, setCompany] = useState("Acme AI");
  const [slug, setSlug] = useState("acme-ai");
  const [payTo, setPayTo] = useState("0.0.1234567");
  const [price, setPrice] = useState("0.001");
  const action = `alive402-${slug || "provider"}-trial-v1`;
  const code = useMemo(
    () => `import { withAlive402 } from "@nikhilraikwar/alive402-sdk";
import { store, resolveEnrollment } from "./alive402-server.js";

export const POST = withAlive402(existingHandler, {
  providerId: "${slug}",
  world: { action: "${action}", resolveEnrollment },
  trial: { freeCalls: 1, store },
  payment: {
    network: "hedera:testnet",
    facilitatorUrl: "https://api.testnet.blocky402.com",
    asset: "0.0.429274",
    amount: "${Math.round(Number(price || 0) * 1_000_000)}",
    payTo: "${payTo}"
  },
  resource: { url: "/v1/research", description: "${company} research API", serviceName: "${company}" }
});
`,
    [action, payTo, price, slug],
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <PageIntro
          eyebrow="For API builders"
          title="Wrap the API you already have."
          copy="Define one fair promotional policy, paste the middleware into your existing endpoint, and let Alive402 handle World eligibility and Hedera continuation."
        />
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-primary/15 bg-soft-blue p-4">
          <code className="rounded bg-background px-3 py-2 text-sm font-semibold">npm install @nikhilraikwar/alive402-sdk</code>
          <p className="text-sm text-muted-foreground">Your World and Hedera secrets stay in server environment variables.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <section className="rounded-2xl border border-border p-6">
            <h2 className="text-xl font-bold">Create a trial policy</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The public demo generates configuration only. Secrets stay in your server environment.
            </p>
            <Field label="Company" value={company} onChange={setCompany} />
            <Field
              label="Provider slug"
              value={slug}
              onChange={(value) => setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
            />
            <Field label="Hedera receiver" value={payTo} onChange={setPayTo} mono />
            <Field label="Price in USDC" value={price} onChange={setPrice} mono />
            <div className="mt-5 rounded-xl bg-soft-blue p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                World action
              </p>
              <code className="mt-2 block break-all text-sm">{action}</code>
            </div>
          </section>
          <section className="overflow-hidden rounded-2xl border border-border bg-code text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Terminal className="size-4" /> TypeScript
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="flex items-center gap-2 text-xs text-white/70 hover:text-white"
              >
                <Copy className="size-3.5" /> Copy
              </button>
            </div>
            <pre className="overflow-x-auto p-5 text-[13px] leading-6 text-slate-200">
              <code>{code}</code>
            </pre>
          </section>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Feature
            icon={<ShieldCheck />}
            title="Fair enrollment"
            copy="World nullifiers scope one promotional entitlement to each provider campaign."
          />
          <Feature
            icon={<Zap />}
            title="Protocol-native revenue"
            copy="The same HTTP endpoint advertises and accepts canonical x402 payments."
          />
          <Feature
            icon={<Check />}
            title="Auditable outcomes"
            copy="Every access decision and settlement creates a sanitized execution receipt."
          />
        </div>
      </div>
    </PageShell>
  );
}
function Field({
  label,
  value,
  onChange,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mono?: boolean;
}) {
  return (
    <label className="mt-5 block text-sm font-semibold">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:border-primary ${mono ? "font-mono text-sm" : ""}`}
      />
    </label>
  );
}
function Feature({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <div className="rounded-xl border border-border p-5">
      <div className="text-primary [&>svg]:size-5">{icon}</div>
      <h3 className="mt-4 font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
    </div>
  );
}
