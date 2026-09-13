import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IDKitRequestWidget,
  selfieCheckLegacy,
  type IDKitResult,
  type RpContext,
} from "@worldcoin/idkit";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Circle,
  ExternalLink,
  Loader2,
  ScanFace,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AppFooter, AppHeader, StatusDot } from "@/components/app-shell";

export const Route = createFileRoute("/demo")({ component: DemoPage });

type DemoState = {
  configured: Record<string, boolean>;
  verified: boolean;
  remaining: number;
  used: number;
  network: string;
  price: string;
};
type SignData = {
  sig: string;
  nonce: string;
  created_at: number;
  expires_at: number;
  app_id: `app_${string}`;
  rp_id: `rp_${string}`;
  action: string;
  environment: "production" | "staging" | "sandbox";
  signal: string;
};
type Result = {
  runId: string;
  answer: string;
  access: "promotion" | "x402";
  latencyMs: number;
  transaction?: string;
  network?: string;
  paymentResponse?: string;
};

function DemoPage() {
  const [state, setState] = useState<DemoState | null>(null);
  const [sign, setSign] = useState<SignData | null>(null);
  const [worldOpen, setWorldOpen] = useState(false);
  const [prompt, setPrompt] = useState("Explain ERC-4626 in simple terms.");
  const [result, setResult] = useState<Result | null>(null);
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [busy, setBusy] = useState<"world" | "request" | "payment" | null>(null);
  const [error, setError] = useState("");

  const refresh = async () => setState(await fetch("/api/demo/state").then((r) => r.json()));
  useEffect(() => {
    void refresh();
  }, []);

  const startWorld = async () => {
    setError("");
    setBusy("world");
    const response = await fetch("/api/world/sign", { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
      setBusy(null);
      return;
    }
    setSign(data);
    setWorldOpen(true);
    setBusy(null);
  };
  const verify = async (proof: IDKitResult) => {
    const response = await fetch("/api/world/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(proof),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Verification failed");
  };
  const requestInference = async () => {
    setBusy("request");
    setError("");
    setResult(null);
    setPaymentRequired(false);
    const response = await fetch("/api/demo/inference", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (response.status === 402) {
      setPaymentRequired(true);
      setBusy(null);
      await refresh();
      return;
    }
    const data = await response.json();
    if (!response.ok) setError(data.message || data.error || "Request failed");
    else setResult(data);
    setBusy(null);
    await refresh();
  };
  const payWithAgent = async () => {
    setBusy("payment");
    setError("");
    const response = await fetch("/api/demo/agent-run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    if (!response.ok) setError(data.message || data.error || "Agent payment failed");
    else {
      setResult(data);
      setPaymentRequired(false);
    }
    setBusy(null);
  };

  const rpContext: RpContext | null = sign
    ? {
        rp_id: sign.rp_id,
        nonce: sign.nonce,
        created_at: sign.created_at,
        expires_at: sign.expires_at,
        signature: sign.sig,
      }
    : null;
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            <span className="size-2 animate-pulse rounded-full bg-success" /> Live product demo
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-6xl">
            One real trial.
            <br />
            Then the request pays.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Complete World Selfie Check, make one promotional call, then watch an autonomous client
            settle the next request through Blocky402 on Hedera.
          </p>
        </div>

        <section className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-demo">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="font-bold">Alive402 Research API</h2>
              <p className="text-sm text-muted-foreground">
                Backend-derived state · no simulated transactions
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-2">
                <StatusDot ok={state?.configured["world"] ?? false} /> World
              </span>
              <span className="flex items-center gap-2">
                <StatusDot ok={state?.configured["hedera"] ?? false} /> Hedera
              </span>
              <span className="flex items-center gap-2">
                <StatusDot ok={state?.configured["inference"] ?? false} /> OpenRouter
              </span>
            </div>
          </div>
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
              <Step
                done={state?.verified ?? false}
                number="1"
                title="Verify with World"
                copy="A live Selfie Check creates a scoped, reusable enrollment."
              />
              <Step
                done={(state?.used ?? 0) > 0}
                active={Boolean(state?.verified && state.remaining > 0)}
                number="2"
                title="Use the promotional call"
                copy={`${state?.remaining ?? 0} of 1 calls remaining`}
              />
              <Step
                done={Boolean(result?.transaction)}
                active={paymentRequired}
                number="3"
                title="Pay per call"
                copy="The same endpoint returns HTTP 402 after the trial."
              />
              {!state?.verified && (
                <button
                  onClick={startWorld}
                  disabled={busy === "world"}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  <ScanFace className="size-4" /> Verify for one free call
                </button>
              )}
              {state?.verified && (
                <div className="mt-5 rounded-lg bg-success-soft p-3 text-sm font-semibold text-emerald-700">
                  <Check className="mr-2 inline size-4" />
                  World enrollment verified
                </div>
              )}
            </div>
            <div className="p-5">
              <label className="text-sm font-semibold" htmlFor="prompt">
                Ask the protected API
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="mt-2 min-h-24 w-full resize-none rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-primary"
              />
              <button
                onClick={requestInference}
                disabled={busy !== null}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy === "request" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}{" "}
                Send request
              </button>
              {paymentRequired && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 size-5 text-red-500" />
                    <div>
                      <h3 className="font-bold">402 Payment Required</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        0.001 USDC · Hedera testnet · Blocky402
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-red-700">
                        PAYMENT-REQUIRED received from /api/demo/inference
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={payWithAgent}
                    disabled={busy !== null}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-payment px-4 py-3 text-sm font-semibold text-white"
                  >
                    {busy === "payment" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Zap className="size-4 text-yellow-300" />
                    )}{" "}
                    Run capped agent · pay 0.001 USDC
                  </button>
                </div>
              )}
              {result && (
                <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-success">
                      {result.access === "promotion" ? "Promotional call" : "x402 settled"}
                    </span>
                    <span className="text-xs text-muted-foreground">{result.latencyMs} ms</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{result.answer}</p>
                  {result.transaction && (
                    <div className="mt-4 rounded-lg border border-emerald-200 bg-success-soft px-3 py-2.5 text-sm text-emerald-800">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-wide">
                        PAYMENT-RESPONSE verified
                      </p>
                      <a
                        className="mt-1 inline-flex items-center gap-1 font-semibold text-primary"
                        target="_blank"
                        rel="noreferrer"
                        href={`https://hashscan.io/testnet/transaction/${encodeURIComponent(result.transaction)}`}
                      >
                        View Hedera settlement <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  )}
                  <div className="mt-3">
                    <Link
                      to="/proof/$runId"
                      params={{ runId: result.runId }}
                      className="text-sm font-semibold text-primary"
                    >
                      Open execution receipt →
                    </Link>
                  </div>
                </div>
              )}
              {error && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
              )}
            </div>
          </div>
        </section>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          Selfie Check is a medium-assurance liveness and continuity signal. It adds friction to
          repeated enrollment; it is not a strict global one-person-one-account guarantee.
        </p>
      </main>
      <AppFooter />
      {sign && rpContext && (
        <IDKitRequestWidget
          open={worldOpen}
          onOpenChange={setWorldOpen}
          app_id={sign.app_id}
          action={sign.action}
          rp_context={rpContext}
          environment={sign.environment}
          allow_legacy_proofs={true}
          preset={selfieCheckLegacy({ signal: sign.signal })}
          handleVerify={verify}
          onSuccess={async () => {
            setWorldOpen(false);
            await refresh();
          }}
          onError={(code) => setError(`World verification stopped: ${code}`)}
        />
      )}
    </div>
  );
}

function Step({
  done,
  active = false,
  number,
  title,
  copy,
}: {
  done: boolean;
  active?: boolean;
  number: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex gap-3 border-b border-border py-5 first:pt-0 last:border-0">
      <div
        className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${done ? "bg-success text-white" : active ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
      >
        {done ? <Check className="size-4" /> : active ? number : <Circle className="size-4" />}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{copy}</p>
      </div>
    </div>
  );
}
