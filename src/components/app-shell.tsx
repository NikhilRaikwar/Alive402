import { Link } from "@tanstack/react-router";
import { Github, Menu } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/demo", label: "Live demo" },
  { to: "/builders", label: "For builders" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/docs", label: "Docs" },
] as const;

export function Logo() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2.5 font-bold tracking-tight text-foreground"
    >
      <img src="/logo.png" className="size-9 rounded-xl" alt="" />{" "}
      <span className="text-lg">Alive402</span>
    </Link>
  );
}

export function AppHeader() {
  return (
    <header className="border-b border-border/70 bg-background/95">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground active:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/NikhilRaikwar/Alive402"
            target="_blank"
            rel="noreferrer"
            className="grid size-9 place-items-center rounded-lg border border-border"
            aria-label="GitHub"
          >
            <Github className="size-4" />
          </a>
          <Link
            to="/demo"
            className="hidden rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white sm:block"
          >
            Try the demo
          </Link>
          <button className="grid size-9 place-items-center md:hidden" aria-label="Menu">
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function AppFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <Logo />
          <p className="mt-2 text-sm text-muted-foreground">One real trial. Then pay per call.</p>
        </div>
        <p className="text-sm text-muted-foreground">Built for ETHOnline 2026 · World + Hedera</p>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main>{children}</main>
      <AppFooter />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="max-w-3xl pt-16 sm:pt-20">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.045em] sm:text-6xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{copy}</p>
    </div>
  );
}

export function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span className={`inline-block size-2 rounded-full ${ok ? "bg-success" : "bg-amber-400"}`} />
  );
}
