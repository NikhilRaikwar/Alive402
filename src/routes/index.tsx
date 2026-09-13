import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Gift,
  Github,
  Globe2,
  Menu,
  RefreshCw,
  ScanFace,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alive402 — Try once. Then the request pays." },
      {
        name: "description",
        content:
          "Alive402 gives a selfie-verified enrollment one promotional API call. After that, the same endpoint returns HTTP 402; a budgeted agent pays on Hedera and unlocks the response—no subscription or API key.",
      },
      { property: "og:title", content: "Alive402 — Try once. Then the request pays." },
      {
        property: "og:description",
        content:
          "Alive402 gives a selfie-verified enrollment one promotional API call. After that, the same endpoint returns HTTP 402; a budgeted agent pays on Hedera and unlocks the response—no subscription or API key.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="inline-flex items-center gap-3 group" aria-label="Alive402 home">
      <img
        src="/logo.png"
        alt="Alive402"
        className={`${
          compact ? "size-9.5" : "size-11"
        } rounded-xl object-contain transition-transform duration-200 group-hover:scale-105 shadow-xs`}
      />
      {!compact && (
        <span className="text-[21px] sm:text-[22px] font-extrabold tracking-tight text-foreground">
          Alive402
        </span>
      )}
    </a>
  );
}

function TechItem({
  icon,
  title,
  note,
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-full border shadow-xs overflow-hidden transition-colors ${
          highlight
            ? "border-primary/30 bg-soft-blue text-primary"
            : "border-border bg-background text-foreground"
        }`}
      >
        {icon}
      </span>
      <span className="text-left">
        <strong
          className={`block text-[12px] leading-4 ${
            highlight ? "text-primary font-bold" : "text-foreground font-semibold"
          }`}
        >
          {title}
        </strong>
        <span className="block text-[10px] leading-4 text-muted-foreground">{note}</span>
      </span>
    </div>
  );
}

const steps = [
  "Checking budget",
  "Signing payment",
  "Settling via Blocky402",
  "Confirmed on Hedera",
  "Response delivered",
] as const;

const codeSamples = {
  "Node.js": `import { withAlive402 } from "@alive402/sdk";

export const POST = withAlive402(handler, {
  trial: "world-selfie-check",
  freeCalls: 1,
  network: "hedera-testnet",
  price: "0.01 USDC"
});`,
  Python: `from alive402 import with_alive402

@with_alive402(
  trial="world-selfie-check",
  free_calls=1,
  network="hedera-testnet",
  price="0.01 USDC"
)
def handler(request):
  return research(request)`,
  cURL: `curl -X POST https://api.example.com/research \\
  -H "Content-Type: application/json" \\
  -H "X-Alive402-Trial: world-selfie-check" \\
  -d '{
    "prompt": "Explain ERC-4626",
    "network": "hedera-testnet"
  }'`,
} as const;

type CodeLanguage = keyof typeof codeSamples;

type DemoState =
  "scanning" | "verified" | "call1_typing" | "call1_done" | "call2_402" | "settling" | "settled";

function DemoPanel() {
  const [state, setState] = useState<DemoState>("scanning");
  const [settleProgress, setSettleProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState("Detecting facial landmarks & lighting...");
  const [scanProgress, setScanProgress] = useState(25);

  const timersRef = useRef<number[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  const addTimer = (fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };

  const startDemoSequence = () => {
    clearAllTimers();
    setState("scanning");
    setSettleProgress(0);
    setScanProgress(20);
    setScanMessage("Detecting facial landmarks & lighting...");

    addTimer(() => {
      setScanProgress(60);
      setScanMessage("Waiting for a valid Selfie Check proof...");
    }, 1300);

    addTimer(() => {
      setScanProgress(88);
      setScanMessage("Preparing the promotional entitlement preview...");
    }, 2600);

    addTimer(() => {
      setScanProgress(100);
      setScanMessage("Selfie Verified ✓ 1 Free Promotional Call unlocked!");
      setState("verified");
    }, 3800);

    addTimer(() => {
      setState("call1_typing");
    }, 5000);

    addTimer(() => {
      setState("call1_done");
    }, 6800);

    addTimer(() => {
      setState("call2_402");
    }, 9200);

    addTimer(() => {
      setState("settling");
      setSettleProgress(1);
    }, 12000);
  };

  const reset = () => {
    startDemoSequence();
  };

  const runPaymentManually = () => {
    if (state !== "call2_402") return;
    clearAllTimers();
    setState("settling");
    setSettleProgress(1);
  };

  useEffect(() => {
    if (state !== "settling" || settleProgress === 0) return;
    if (settleProgress >= steps.length) {
      const done = window.setTimeout(() => {
        setState("settled");
      }, 500);
      return () => window.clearTimeout(done);
    }
    const timer = window.setTimeout(() => {
      setSettleProgress((p) => p + 1);
    }, 620);
    return () => window.clearTimeout(timer);
  }, [state, settleProgress]);

  useEffect(() => {
    startDemoSequence();
    return () => clearAllTimers();
  }, []);

  const isStep1Done = state !== "scanning";
  const isStep2Done =
    state === "call1_done" || state === "call2_402" || state === "settling" || state === "settled";
  const isStep2Active = state === "verified" || state === "call1_typing";
  const isStep3Done = state === "settled";
  const isStep3Active = state === "call2_402" || state === "settling";

  const showCameraView = state === "scanning" || state === "verified";

  return (
    <section
      id="demo"
      className="mt-16 scroll-mt-6 rounded-2xl border border-border bg-background p-4 sm:p-6 shadow-demo"
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-1 pb-5 border-b border-border/60">
        <div className="flex min-w-0 items-center gap-3.5">
          <Brand compact />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-[20px] sm:text-[22px] font-bold text-foreground">
                Alive402 Live Service
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-[11px] font-semibold text-success border border-success/20">
                <span className="size-2 rounded-full bg-success live-pulse" />
                Prototype flow · Testnet target
              </span>
            </div>
            <p className="truncate text-[12px] text-muted-foreground mt-0.5">
              Interactive UI preview: Selfie Check → Promotional call → HTTP 402 → agent payment.
            </p>
          </div>
        </div>
        <Button
          variant="clean"
          size="sm"
          onClick={reset}
          className="gap-2 text-[12px] font-medium transition-colors hover:bg-muted cursor-pointer"
        >
          <RefreshCw
            className={`size-3.5 ${
              state === "scanning" || state === "settling" ? "animate-spin text-primary" : ""
            }`}
          />
          <span>Restart demo</span>
        </Button>
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-[45fr_55fr]">
        {/* Left Column: Flow Timeline */}
        <div className="overflow-hidden rounded-xl border border-border bg-background px-5 py-3 divide-y divide-border">
          {[
            {
              n: "1",
              tag: "World ID Verification",
              title: "Verify with World Selfie Check",
              lines: isStep1Done
                ? "Selfie verified & enrollment active on World sandbox."
                : "Checking biometric liveness to prevent bot farming.",
              badge: isStep1Done ? "Verified ✓" : "Scanning...",
              isDone: isStep1Done,
              cost: "Free",
              costStyle: "bg-success-soft text-success border-success/20",
              badgeStyle: isStep1Done
                ? "bg-success-soft text-success border border-success/20"
                : "bg-primary text-primary-foreground",
            },
            {
              n: "2",
              tag: "Fair Promotional Sample",
              title: "Call #1 — Promotional ($0.00)",
              lines: isStep2Done
                ? "Free promotional call delivered successfully. Remaining free balance: 0."
                : isStep2Active
                  ? "Delivering AI research response at zero cost ($0.00)..."
                  : "Selfie check grants 1 free promotional call without credit cards or keys.",
              badge: isStep2Done
                ? "1 / 1 Used ($0)"
                : isStep2Active
                  ? "Delivering ($0)..."
                  : "1 Free Call",
              isDone: isStep2Done,
              cost: "$0.00 Free",
              costStyle: isStep2Done
                ? "bg-soft-blue text-primary border-primary/20"
                : "bg-muted text-muted-foreground border-border",
              badgeStyle: isStep2Done
                ? "bg-soft-blue text-primary border border-primary/20 font-semibold"
                : isStep2Active
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground border border-border",
            },
            {
              n: "3",
              tag: "Hedera x402 Micropayment",
              title: "Call #2 — HTTP 402 Payment",
              lines: isStep3Done
                ? "Settled 0.01 USDC via Blocky402 on Hedera Testnet. Response unlocked."
                : state === "settling"
                  ? "Budgeted agent signing and settling 0.01 USDC payment on Hedera..."
                  : isStep3Active
                    ? "Quota reached (0 left). Same API endpoint returns HTTP 402 Payment Required."
                    : "Future calls require micro-payment on Hedera Testnet.",
              badge: isStep3Done
                ? "Settled ✓"
                : state === "settling"
                  ? "Settling..."
                  : isStep3Active
                    ? "HTTP 402"
                    : "0.01 USDC",
              isDone: isStep3Done,
              cost: "0.01 USDC",
              costStyle: isStep3Done
                ? "bg-success-soft text-success border-success/20"
                : isStep3Active
                  ? "bg-destructive/10 text-destructive border-destructive/20 font-bold"
                  : "bg-muted text-muted-foreground border-border",
              badgeStyle: isStep3Done
                ? "bg-success-soft text-success border border-success/20"
                : state === "settling"
                  ? "bg-primary text-primary-foreground"
                  : isStep3Active
                    ? "bg-destructive text-primary-foreground font-bold shadow-xs"
                    : "bg-muted text-muted-foreground border border-border",
            },
          ].map((item, index) => (
            <div
              key={item.n}
              className="relative grid min-h-[120px] grid-cols-[36px_minmax(0,1fr)_auto] items-start gap-4 py-4.5"
            >
              {index < 2 && (
                <span className="absolute left-[17px] top-[54px] h-[85px] w-px bg-border -z-0" />
              )}
              <span
                className={`relative z-10 mt-1 grid size-9 place-items-center rounded-full text-[14px] font-bold transition-all ${
                  item.isDone
                    ? "bg-success text-primary-foreground shadow-xs"
                    : item.badgeStyle.includes("bg-primary")
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {item.isDone ? <Check className="size-4.5 stroke-[2.5]" /> : item.n}
              </span>
              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {item.tag}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-semibold border ${item.costStyle}`}
                  >
                    {item.cost}
                  </span>
                </div>
                <h3 className="text-[14px] font-bold leading-5 text-foreground">{item.title}</h3>
                <p className="mt-1 text-[12px] leading-[1.55] text-muted-foreground">
                  {item.lines}
                </p>
              </div>
              <span
                className={`mt-1 h-fit rounded-md px-2.5 py-1 text-[10px] font-semibold transition-colors ${item.badgeStyle}`}
              >
                {item.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Right Column: Interactive Facial Scanner OR AI Assistant */}
        {showCameraView ? (
          <div className="flex flex-col justify-between rounded-xl border border-border bg-soft-blue/35 p-4 sm:p-5">
            {/* Camera Header */}
            <div>
              <div className="flex items-start justify-between gap-3 px-1 pb-3.5 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-xs">
                    <ScanFace className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-[13px] font-bold text-foreground">World Selfie Check</h3>
                    <p className="text-[10px] text-muted-foreground">
                      Selfie Check & Fair Trial Enrollment
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-background px-2.5 py-1 text-[10px] font-medium text-primary border border-primary/20">
                  <span className="size-1.5 rounded-full bg-primary" />
                  Sandbox target
                </span>
              </div>

              {/* Viewfinder Camera Area (Clean Whitish Aesthetic) */}
              <div className="relative my-3.5 flex min-h-[250px] flex-col items-center justify-center overflow-hidden rounded-xl border border-border/90 bg-background p-6 text-center text-foreground shadow-xs">
                {/* Corner reticle guides */}
                <div className="absolute left-3 top-3 size-4 border-l-2 border-t-2 border-primary" />
                <div className="absolute right-3 top-3 size-4 border-r-2 border-t-2 border-primary" />
                <div className="absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-primary" />

                {/* Animated Laser Beam */}
                <div
                  className={`pointer-events-none absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_10px_oklch(0.56_0.235_257/0.45)] transition-opacity duration-300 ${
                    state === "scanning" ? "scan-beam opacity-100" : "hidden"
                  }`}
                />

                {/* Biometric Face reticle */}
                <div className="relative my-2">
                  {state === "verified" ? (
                    <div className="enter-up grid size-20 place-items-center rounded-full border-2 border-success bg-success-soft text-success shadow-xs">
                      <CheckCircle2 className="size-10 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="relative grid size-20 place-items-center rounded-full border-2 border-dashed border-primary bg-soft-blue text-primary shadow-xs pulse-ring transition-all duration-300">
                      <ScanFace className="size-10 text-primary" />
                      <div className="absolute inset-0 animate-ping rounded-full border border-primary/30" />
                    </div>
                  )}
                </div>

                {/* Scan Status Text */}
                <div className="mt-3 max-w-[290px]">
                  <p
                    className={`text-[12px] font-bold transition-colors ${
                      state === "verified" ? "text-success" : "text-foreground"
                    }`}
                  >
                    {scanMessage}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {state === "verified"
                      ? "1 Free promotional call unlocked"
                      : "A real World proof will be verified by the backend"}
                  </p>
                </div>

                {/* Progress Bar during scan */}
                {state === "scanning" && (
                  <div className="mt-3.5 h-1.5 w-44 overflow-hidden rounded-full bg-muted border border-border/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Viewfinder Action */}
            <div className="pt-2">
              {state === "scanning" ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-background py-2.5 px-3 text-[12px] font-medium text-foreground border border-border shadow-2xs">
                  <RefreshCw className="size-3.5 animate-spin text-primary" />
                  Previewing the World verification state...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-success-soft py-2.5 px-3 text-[12px] font-semibold text-success border border-success/20">
                  <CheckCircle2 className="size-4" />
                  Verified! Running promotional trial call...
                </div>
              )}
            </div>
          </div>
        ) : (
          /* AI Assistant & Payment Execution View */
          <div className="flex flex-col justify-between rounded-xl border border-border bg-soft-blue/35 p-4 sm:p-5">
            <div>
              {/* Assistant Header */}
              <div className="flex items-start justify-between gap-3 px-1 pb-3.5 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-xs">
                    <Sparkles className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-[13px] font-bold text-foreground">AI Research Assistant</h3>
                    <p className="text-[10px] text-muted-foreground">Powered by Alive402</p>
                  </div>
                </div>
                <span className="rounded-md bg-background/90 px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
                  Model: gpt-4o-mini
                </span>
              </div>

              {/* Call #1 Dialog */}
              <div className="mt-3.5 space-y-2">
                <div className="ml-auto w-fit max-w-[85%] rounded-xl bg-soft-blue px-3.5 py-2 text-[11px] font-medium text-primary border border-primary/10">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary/70">
                      Call #1 · Promotional ($0.00)
                    </span>
                  </div>
                  Explain ERC-4626 in simple terms.
                </div>
                <div className="flex gap-2.5 rounded-xl bg-background p-3 text-[11px] leading-[1.55] text-muted-foreground border border-border/80 shadow-2xs">
                  <span className="grid size-5.5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Sparkles className="size-3" />
                  </span>
                  <p>
                    ERC-4626 is a standard for tokenized vaults on Ethereum. It defines a common way
                    for smart contracts to accept deposits, issue share tokens, and manage
                    withdrawals.
                  </p>
                </div>
              </div>

              {/* Call #2: HTTP 402 Card */}
              <div className="mt-3.5 rounded-xl border border-destructive/20 bg-danger-soft p-4 enter-up">
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-destructive/10">
                  <span className="text-[10px] font-semibold text-destructive">
                    Call #2 — Promotional quota: 0 remaining
                  </span>
                  <span className="font-mono text-[9px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-bold">
                    HTTP 402
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="grid size-5.5 shrink-0 place-items-center rounded-full bg-destructive text-primary-foreground text-[11px] font-bold">
                    !
                  </span>
                  <div>
                    <h4 className="text-[13px] font-bold text-foreground">
                      HTTP 402 Payment Required
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Same endpoint. Budgeted agent settles on Hedera to continue.
                    </p>
                  </div>
                </div>

                <dl className="mt-3 space-y-1.5 border-t border-destructive/10 pt-2.5 text-[11px]">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Amount</dt>
                    <dd className="font-semibold text-foreground">0.01 USDC</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Network</dt>
                    <dd className="font-semibold text-foreground">Hedera Testnet</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Facilitator</dt>
                    <dd className="font-semibold text-foreground">Blocky402</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Recipient</dt>
                    <dd className="font-mono text-[10px] font-semibold text-foreground">
                      alive402.test
                    </dd>
                  </div>
                </dl>

                <Button
                  variant="payment"
                  className="mt-4 h-10.5 w-full text-[12px] font-semibold transition-all shadow-xs cursor-pointer"
                  onClick={runPaymentManually}
                  disabled={state === "settling" || state === "settled"}
                >
                  <Zap
                    className={`size-3.5 fill-current text-chart-4 ${
                      state === "settling" ? "animate-bounce" : ""
                    }`}
                  />
                  {state === "settling"
                    ? `${steps[Math.max(0, settleProgress - 1)]}...`
                    : state === "settled"
                      ? "Payment confirmed ✓"
                      : "Agent settling payment →"}
                </Button>
              </div>

              {/* 5-Step Progress Rail */}
              <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-3 sm:grid-cols-5 sm:gap-0">
                {steps.map((label, index) => {
                  const isStepDone = settleProgress > index || state === "settled";
                  const isStepCurrent = state === "settling" && settleProgress === index + 1;

                  return (
                    <div
                      key={label}
                      className="relative flex min-w-0 flex-col items-center text-center sm:before:absolute sm:before:left-0 sm:before:right-0 sm:before:top-2.5 sm:before:-z-0 sm:before:h-px sm:before:bg-border first:before:left-1/2 last:before:right-1/2"
                    >
                      <span
                        className={`relative z-10 grid size-5 place-items-center rounded-full border text-[9px] font-bold transition-all ${
                          isStepDone
                            ? "border-success bg-success text-primary-foreground scale-105"
                            : isStepCurrent
                              ? "border-primary bg-primary text-primary-foreground ring-2 ring-primary/20 scale-110"
                              : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {isStepDone ? <Check className="size-3 stroke-[2.5]" /> : index + 1}
                      </span>
                      <span
                        className={`relative z-10 mt-1.5 max-w-[72px] text-[9px] leading-[1.3] transition-colors ${
                          isStepDone
                            ? "font-medium text-foreground"
                            : isStepCurrent
                              ? "font-bold text-primary"
                              : "text-muted-foreground"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Settlement Proof and Unlocked Response */}
            {state === "settled" && (
              <div className="mt-4 space-y-2.5 enter-up">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-success-soft px-3.5 py-3 border border-success/20">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <CheckCircle2 className="size-4.5 shrink-0 text-success" />
                    <div className="min-w-0">
                      <strong className="block text-[11px] font-bold text-success">
                        Settlement: Confirmed
                      </strong>
                      <span className="block truncate text-[9px] text-muted-foreground">
                        Facilitator: Blocky402 · Hedera Testnet (0.0.48291)
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://hashscan.io/testnet/transaction/0.0.48291"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-background/90 px-2.5 py-1 text-[10px] font-medium text-success border border-success/30 hover:bg-background transition-colors"
                  >
                    HashScan <ExternalLink className="size-3" />
                  </a>
                </div>

                <div className="flex gap-2.5 rounded-xl bg-background p-3 text-[11px] leading-[1.55] text-muted-foreground border border-border/80">
                  <span className="grid size-5.5 shrink-0 place-items-center rounded-full bg-success text-primary-foreground">
                    <Check className="size-3 stroke-[2.5]" />
                  </span>
                  <p>
                    <strong className="text-foreground">Response unlocked:</strong> ERC-4626
                    converts assets to shares via{" "}
                    <code className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                      convertToShares()
                    </code>{" "}
                    and calculates redemption values via{" "}
                    <code className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
                      convertToAssets()
                    </code>
                    .
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

function BuilderSection() {
  const [language, setLanguage] = useState<CodeLanguage>("Node.js");
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeSamples[language]);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  const tabs: CodeLanguage[] = ["Node.js", "Python", "cURL"];

  return (
    <section
      id="builders"
      className="scroll-mt-8 rounded-2xl bg-soft-blue p-6 sm:p-9 border border-primary/10"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[40fr_60fr]">
        <div>
          <p className="text-[11px] font-bold uppercase text-primary tracking-[0.12em]">
            For builders
          </p>
          <h2 className="mt-2 text-[32px] font-bold leading-[1.08] tracking-[-0.035em] sm:text-[36px] text-foreground">
            Wrap the API you already have.
          </h2>
          <p className="mt-3.5 text-[14px] leading-[1.6] text-muted-foreground">
            Use Alive402 as a middleware or a small SDK. Add a fair free-to-paid flow to any HTTP
            service in a few lines.
          </p>
          <Button asChild variant="brand" size="landing" className="mt-6 h-11 px-5 shadow-sm">
            <a href="#demo">
              View integration guide <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>

        <div>
          <div className="overflow-hidden rounded-xl bg-code text-primary-foreground shadow-md border border-primary-foreground/10">
            {/* Header Tabs */}
            <div
              className="flex h-11 items-center border-b border-primary-foreground/10 px-3.5 bg-black/20"
              role="tablist"
              aria-label="Integration language"
            >
              <div className="flex items-center gap-1.5">
                {tabs.map((tab) => {
                  const isActive = language === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`panel-${tab}`}
                      id={`tab-${tab}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => {
                        setLanguage(tab);
                        setCopied(false);
                      }}
                      className={`h-7.5 cursor-pointer rounded-md px-3 text-[12px] font-medium transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Copy Action Button */}
              <button
                type="button"
                onClick={copyCode}
                aria-label="Copy code to clipboard"
                className="ml-auto flex h-7.5 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-[11px] text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-success stroke-[2.5]" />
                    <span className="text-[11px] font-semibold text-success">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span className="hidden sm:inline text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Output */}
            <div
              role="tabpanel"
              id={`panel-${language}`}
              aria-labelledby={`tab-${language}`}
              className="p-5"
            >
              <pre className="min-h-[170px] overflow-x-auto font-mono text-[12px] leading-[1.65] text-primary-foreground/90 selection:bg-primary/40 selection:text-white">
                <code>{codeSamples[language]}</code>
              </pre>
            </div>
          </div>

          {/* Value Props Row */}
          <div className="mt-4 grid gap-3.5 sm:grid-cols-3">
            {[
              ["Works with any API", "Add in minutes"],
              ["Configurable policy", "Free calls, pricing, network"],
              ["Built for agents", "Programmatic payments"],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4.5 shrink-0 text-primary mt-0.5" />
                <span>
                  <strong className="block text-[11px] font-bold text-foreground">{title}</strong>
                  <span className="block text-[10px] text-muted-foreground">{desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Navbar */}
      <nav
        className="mx-auto grid h-18 max-w-[1140px] grid-cols-[minmax(0,1fr)_auto] items-center px-5 sm:grid-cols-[1fr_auto_1fr] sm:px-8"
        aria-label="Main navigation"
      >
        <Brand />
        <div className="hidden items-center justify-center gap-10 text-[13px] font-medium text-muted-foreground sm:flex">
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#builders" className="transition-colors hover:text-foreground">
            For builders
          </a>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button asChild variant="brand" size="landing" className="h-10 px-5 shadow-sm">
            <a href="#demo">
              Try live <ArrowRight className="size-3.5" />
            </a>
          </Button>
          <Menu className="size-5 sm:hidden text-foreground" />
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="mx-auto max-w-[1140px] px-5 sm:px-8 pb-16">
        {/* Hero Section */}
        <section className="mx-auto max-w-[840px] pt-[72px] text-center">
          <p className="enter-up text-[11px] font-bold uppercase text-primary [animation-duration:350ms] tracking-[0.12em]">
            ONE SELFIE. ONE FREE CALL. THEN HTTP 402.
          </p>
          <h1 className="enter-up mx-auto mt-4 max-w-[760px] text-[46px] font-bold leading-[1.02] [animation-delay:80ms] tracking-[-0.045em] sm:text-[58px] lg:text-[68px] text-foreground">
            Try once.
            <br />
            Then <span className="text-primary">the request pays.</span>
          </h1>
          <p className="enter-up mx-auto mt-5 max-w-[720px] text-[16px] leading-[1.65] text-muted-foreground [animation-delay:140ms] sm:text-[18px]">
            Alive402 gives a selfie-verified enrollment one promotional API call. After that, the
            same endpoint returns HTTP 402; a budgeted agent pays on Hedera and unlocks the
            response—no subscription or API key.
          </p>
          <div className="enter-up mt-7 flex flex-col justify-center gap-3.5 [animation-delay:200ms] min-[420px]:flex-row">
            <Button
              asChild
              variant="brand"
              size="landing"
              className="min-w-[190px] h-11 text-[13px] shadow-sm"
            >
              <a href="#demo">
                Try the live service <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="clean"
              size="landing"
              className="min-w-[150px] h-11 text-[13px]"
            >
              <a href="#how">See how it works</a>
            </Button>
          </div>

          {/* Hero Tech Row */}
          <div className="enter-up mt-11 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 [animation-delay:260ms] sm:gap-x-16">
            <TechItem
              icon={<img src="/world.png" alt="World ID" className="size-6 object-contain" />}
              title="World"
              note="Selfie Check"
            />
            <TechItem
              icon={
                <img
                  src="/hedera.png"
                  alt="Hedera"
                  className="size-6.5 object-contain rounded-full"
                />
              }
              title="Hedera"
              note="Testnet settlement"
            />
            <TechItem
              icon={
                <span className="grid size-full place-items-center rounded-full bg-soft-blue text-primary font-extrabold text-[11px] tracking-tight">
                  402
                </span>
              }
              title="x402"
              note="HTTP 402"
              highlight
            />
          </div>
        </section>

        {/* Interactive Demo Panel */}
        <DemoPanel />

        {/* How It Works Section */}
        <Reveal className="pt-24">
          <section id="how" className="scroll-mt-8">
            <div className="text-center">
              <p className="text-[11px] font-bold uppercase text-primary tracking-[0.12em]">
                How it works
              </p>
              <h2 className="mt-2.5 text-[36px] font-bold leading-tight tracking-[-0.035em] sm:text-[42px] text-foreground">
                From selfie to settlement.
              </h2>
              <p className="mt-2.5 text-[15px] text-muted-foreground">
                A simple flow that makes AI access fair for humans and seamless for agents.
              </p>
            </div>

            <div className="relative mt-10 grid gap-5 md:grid-cols-3 md:gap-7">
              {[
                {
                  icon: <ScanFace className="size-6" />,
                  n: "1",
                  title: "Verify yourself",
                  text: (
                    <>
                      Complete World Selfie Check
                      <br />
                      to get a verified enrollment.
                    </>
                  ),
                },
                {
                  icon: <Gift className="size-6" />,
                  n: "2",
                  title: "Get one free call",
                  text: (
                    <>
                      Use the service once,
                      <br />
                      no payment required.
                    </>
                  ),
                },
                {
                  icon: <Zap className="size-6" />,
                  n: "3",
                  title: "Pay per call",
                  text: (
                    <>
                      Next requests return HTTP 402.
                      <br />
                      A budgeted agent settles on Hedera
                      <br />
                      and the response is unlocked.
                    </>
                  ),
                },
              ].map((card, index) => (
                <div
                  key={card.n}
                  className="relative min-h-[145px] rounded-xl border border-border bg-background p-6 transition-transform duration-150 hover:-translate-y-0.5 shadow-2xs"
                >
                  <div className="flex gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-soft-blue text-primary shadow-xs">
                      {card.icon}
                    </span>
                    <div>
                      <span className="text-[24px] font-bold leading-none text-primary">
                        {card.n}
                      </span>
                      <h3 className="mt-1.5 text-[15px] font-bold text-foreground">{card.title}</h3>
                      <p className="mt-1 text-[11px] leading-[1.55] text-muted-foreground">
                        {card.text}
                      </p>
                    </div>
                  </div>
                  {index < 2 && (
                    <ArrowRight className="absolute -right-6 top-1/2 z-10 hidden size-4.5 -translate-y-1/2 text-primary md:block" />
                  )}
                  <ArrowDown className="absolute -bottom-5 left-1/2 z-10 size-4.5 -translate-x-1/2 text-primary md:hidden" />
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Builder Section */}
        <Reveal className="pt-[80px]">
          <BuilderSection />
        </Reveal>

        {/* Compact Final CTA Strip */}
        <Reveal className="pt-12">
          <section className="grid items-center gap-6 rounded-2xl bg-soft-blue px-6 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-9 border border-primary/10">
            <div>
              <h2 className="text-[25px] sm:text-[28px] font-bold tracking-[-0.025em] text-foreground">
                Let people try. Let agents pay.
              </h2>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Integration targets: Hedera Testnet &nbsp;·&nbsp; World Sandbox &nbsp;·&nbsp;
                Blocky402
              </p>
            </div>
            <Button
              asChild
              variant="brand"
              size="landing"
              className="w-full sm:w-auto h-11 px-6 shadow-sm"
            >
              <a href="#demo">
                Try the live service <ArrowRight className="size-4" />
              </a>
            </Button>
          </section>
        </Reveal>
      </main>

      {/* Footer */}
      <footer className="mx-auto mt-[80px] max-w-[1140px] border-t border-border px-5 pb-12 pt-8 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row text-[12px] text-muted-foreground">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2">
            <Brand />
            <span className="hidden md:inline text-border">|</span>
            <span className="text-center sm:text-left text-[11px]">
              Prove you’re live. Try once. Then pay per call.
            </span>
          </div>
          <div className="flex items-center justify-center gap-8 font-medium text-[13px]">
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#builders" className="transition-colors hover:text-foreground">
              For builders
            </a>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-3 text-[11px]">
            <a
              href="https://github.com/NikhilRaikwar/Alive402"
              aria-label="GitHub repository"
              target="_blank"
              rel="noreferrer"
              className="text-foreground transition-colors hover:text-primary flex items-center gap-1.5"
            >
              <Github className="size-4" />
            </a>
            <span>Built for ETHGlobal 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
