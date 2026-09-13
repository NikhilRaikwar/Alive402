import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Gift, ReceiptText, RefreshCw, TriangleAlert, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AccessRun } from "@alive402/sdk";
import { PageIntro, PageShell } from "@/components/app-shell";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });
type Filter = "all" | "promotion" | "payment_required" | "settled" | "payment_failed";
const filters: { key: Filter; label: string }[] = [{ key: "all", label: "All" }, { key: "promotion", label: "Promotion" }, { key: "payment_required", label: "Payment required" }, { key: "settled", label: "Settled" }, { key: "payment_failed", label: "Failed" }];

function DashboardPage() {
  const [events, setEvents] = useState<AccessRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const refresh = async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/providers/alive402-demo/events", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load provider events");
      setEvents(result.events ?? []);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load provider events"); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);
  const metrics = useMemo(() => ({
    promotions: events.filter((x) => x.decision === "promotion_consumed").length,
    challenges: events.filter((x) => x.decision === "payment_required").length,
    settled: events.filter((x) => x.decision === "settled").length,
    failed: events.filter((x) => x.decision === "payment_failed").length,
    total: events.length,
  }), [events]);
  const visible = events.filter((x) => filter === "all" || x.decision === filter || (filter === "promotion" && x.decision === "promotion_consumed"));
  return <PageShell><div className="mx-auto max-w-6xl px-5 lg:px-8">
    <div className="flex flex-wrap items-end justify-between gap-5"><PageIntro eyebrow="Provider console" title="Every trial decision, visible." copy="Live server-side evidence of promotional access, payment challenges, settlements, and failures for the Alive402 demo provider." />
      <button onClick={refresh} disabled={loading} className="mb-1 flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold disabled:opacity-60"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button></div>
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"><Metric icon={<Gift />} label="Promotional calls" value={metrics.promotions} /><Metric icon={<ReceiptText />} label="402 challenges" value={metrics.challenges} /><Metric icon={<Zap />} label="Paid calls" value={metrics.settled} /><Metric icon={<TriangleAlert />} label="Failed payments" value={metrics.failed} /><Metric icon={<Clock />} label="Recorded decisions" value={metrics.total} /></div>
    <section className="mt-6 overflow-hidden rounded-2xl border border-border"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><div><h2 className="font-bold">Live request log</h2><p className="mt-1 text-sm text-muted-foreground">Sanitized events from the configured store</p></div><div className="flex flex-wrap gap-2">{filters.map((item) => <button key={item.key} onClick={() => setFilter(item.key)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === item.key ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{item.label}</button>)}</div></div>
      {error ? <div className="p-10 text-center"><TriangleAlert className="mx-auto size-6 text-red-600" /><h3 className="mt-4 font-semibold">Dashboard unavailable</h3><p className="mt-2 text-sm text-muted-foreground">{error}</p><button onClick={refresh} className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">Try again</button></div>
      : loading ? <div className="p-10 text-center text-sm text-muted-foreground">Loading server-side request evidence…</div>
      : visible.length === 0 ? <div className="p-10 text-center"><Clock className="mx-auto size-6 text-muted-foreground" /><h3 className="mt-4 font-semibold">No matching requests</h3><p className="mt-2 text-sm text-muted-foreground">Run the live demo and its access decisions will appear here.</p><Link to="/demo" className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white">Open live demo</Link></div>
      : <div className="divide-y divide-border">{visible.map((event) => <Link key={event.id} to="/proof/$runId" params={{ runId: event.id }} className="grid gap-3 px-5 py-4 hover:bg-muted/30 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center"><div><p className="font-semibold">{(event.prompt || "Protected API request").slice(0, 120)}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()} · {event.mode}{event.amount ? ` · ${event.amount}` : ""}</p><p className="mt-1 font-mono text-[11px] text-muted-foreground">{event.id}</p></div><Status decision={event.decision} /><ArrowUpRight className="size-4 text-muted-foreground" /></Link>)}</div>}
    </section>
  </div></PageShell>;
}
function Status({ decision }: { decision: string }) { const tone = decision === "settled" ? "bg-success-soft text-emerald-700" : decision === "payment_required" ? "bg-red-50 text-red-700" : decision === "payment_failed" ? "bg-amber-50 text-amber-800" : "bg-soft-blue text-primary"; return <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{decision.replaceAll("_", " ")}</span>; }
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="rounded-xl border border-border p-5"><div className="flex items-center justify-between text-primary [&>svg]:size-5"><span className="text-sm font-medium text-muted-foreground">{label}</span>{icon}</div><p className="mt-5 text-3xl font-bold tracking-tight">{value}</p></div>; }
