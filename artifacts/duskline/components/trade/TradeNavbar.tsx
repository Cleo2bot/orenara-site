"use client";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";

export default function TradeNavbar() {
  const scrollToForm = () => {
    document.getElementById("trade-enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "color-mix(in srgb, var(--ink) 94%, transparent)",
        borderBottom: "1px solid var(--ink-line)",
      }}
    >
      <nav
        className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4"
        style={{ height: "68px" }}
      >
        <Link
          href="/"
          aria-label="Orenara home"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "baseline",
            gap: "10px",
          }}
          data-testid="nav-home-link"
        >
          <Wordmark size="sm" />
          <span
            className="spec-mono-upper"
            style={{
              fontSize: "0.6875rem",
              color: "var(--bone-dim)",
              letterSpacing: "0.18em",
            }}
          >
            Trade
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/quote-builder"
            className="hidden md:inline-flex whitespace-nowrap"
            style={{
              color: "var(--bone-dim)",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
            data-testid="nav-quote-builder-link"
          >
            Build Your Kit
          </Link>
          <Link
            href="/"
            className="hidden md:inline-flex whitespace-nowrap"
            style={{
              color: "var(--bone-dim)",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
            data-testid="nav-homeowners-link"
          >
            For homeowners
          </Link>
          <button
            onClick={scrollToForm}
            className="btn-outline w-auto whitespace-nowrap"
            style={{ padding: "10px 18px", fontSize: "0.8125rem" }}
            data-testid="nav-trade-quote-btn"
          >
            <span className="hidden sm:inline">Get a Trade Quote</span>
            <span className="sm:hidden">Trade Quote</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
