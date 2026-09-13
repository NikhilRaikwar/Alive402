import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ExternalLink, FileCheck2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { AccessRun } from "@alive402/sdk";
import { PageShell } from "@/components/app-shell";

export const Route = createFileRoute("/proof/$runId")({ component: ProofPage });
function ProofPage() {
  const { runId } = Route.useParams();
  const [run, setRun] = useState<AccessRun | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    fetch(`/api/runs/${runId}`).then(async (response) => {
      if (!response.ok) setMissing(true);
      else setRun(await response.json());
    });
  }, [runId]);
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
          <FileCheck2 className="size-4" /> Execution receipt
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Access decision evidence</h1>
        {missing ? (
          <p className="mt-8 rounded-xl border border-border p-6">
            This receipt was not found in the configured store.
          </p>
        ) : !run ? (
          <p className="mt-8 text-muted-foreground">Loading receipt…</p>
        ) : (
          <section className="mt-8 overflow-hidden rounded-2xl border border-border">
            <div className="flex items-center gap-3 border-b border-border bg-success-soft p-5 text-emerald-800">
              <CheckCircle2 className="size-5" />
              <div>
                <p className="font-bold">Decision recorded</p>
                <p className="text-sm">Generated from server-side access and payment state</p>
              </div>
            </div>
            <dl className="grid divide-y divide-border text-sm">
              {[
                ["Run ID", run.id],
                ["Provider", run.providerId],
                ["Access mode", run.mode],
                ["Decision", run.decision],
                ["Recorded", new Date(run.createdAt).toLocaleString()],
                ["Amount", run.amount || "No payment"],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-2 px-5 py-4 sm:grid-cols-[160px_1fr]">
                  <dt className="font-medium text-muted-foreground">{label}</dt>
                  <dd className="break-all font-mono">{value}</dd>
                </div>
              ))}
            </dl>
            {run.transaction && (
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://hashscan.io/testnet/transaction/${encodeURIComponent(run.transaction)}`}
                className="flex items-center justify-between border-t border-border px-5 py-4 font-semibold text-primary"
              >
                Verify on HashScan <ExternalLink className="size-4" />
              </a>
            )}
          </section>
        )}
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          This public receipt excludes World proof material, nullifiers, private keys and payment
          signatures.
        </p>
      </div>
    </PageShell>
  );
}
