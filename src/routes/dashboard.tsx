import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Gift, ReceiptText, RefreshCw, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { AccessRun } from "@alive402/sdk";
import { PageIntro, PageShell } from "@/components/app-shell";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const [events, setEvents] = useState<AccessRun[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    setLoading(true);
    const result = await fetch("/api/providers/alive402-demo/events").then((r) => r.json());
    setEvents(result.events ?? []);
    setLoading(false);
  };
  useEffect(() => {
    void refresh();
  }, []);
  const promotions = events.filter((event) => event.mode === "promotion").length;
  const paid = events.filter((event) => event.decision === "settled").length;
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <PageIntro
            eyebrow="Provider console"
            title="Every trial decision, visible."
            copy="A real-time merchant view of verified sampling, payment challenges, and settled requests for the Alive402 demo provider."
          />
          <button
            onClick={refresh}
            className="mb-1 flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Metric icon={<Gift />} label="Promotional calls" value={String(promotions)} />
          <Metric icon={<Zap />} label="Paid calls" value={String(paid)} />
          <Metric icon={<ReceiptText />} label="Recorded decisions" value={String(events.length)} />
        </div>
        <section className="mt-6 overflow-hidden rounded-2xl border border-border">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-bold">Live request log</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sanitized events from the configured store
            </p>
          </div>
          {events.length === 0 ? (
            <div className="p-10 text-center">
              <Clock className="mx-auto size-6 text-muted-foreground" />
              <h3 className="mt-4 font-semibold">No requests recorded yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Run the live demo and its access decisions will appear here.
              </p>
              <Link
                to="/demo"
                className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white"
              >
                Open live demo
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to="/proof/$runId"
                  params={{ runId: event.id }}
                  className="grid gap-3 px-5 py-4 hover:bg-muted/30 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <div>
                    <p className="font-semibold">{event.prompt || "Protected API request"}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{event.id}</p>
                  </div>
                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${event.decision === "settled" ? "bg-success-soft text-emerald-700" : event.decision === "payment_required" ? "bg-red-50 text-red-700" : "bg-soft-blue text-primary"}`}
                  >
                    {event.decision.replaceAll("_", " ")}
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-5">
      <div className="flex items-center justify-between text-primary [&>svg]:size-5">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon}
      </div>
      <p className="mt-5 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
