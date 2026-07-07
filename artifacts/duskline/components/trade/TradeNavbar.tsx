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
        background: "var(--ink)",
        borderBottom: "1px solid var(--ink-line)",
        backdropFilter: "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }} aria-label="Orenara home">
            <Wordmark size="sm" />
          </Link>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 500,
              color: "var(--bone-dim)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              border: "1px solid var(--ink-line)",
              borderRadius: "var(--radius)",
              padding: "2px 7px",
            }}
          >
            Trade
          </span>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/quote-builder"
            className="hidden sm:inline-flex whitespace-nowrap"
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
            className="hidden sm:inline-flex"
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
            className="btn-outline hidden sm:inline-flex w-auto"
            style={{ padding: "9px 18px", fontSize: "0.8125rem" }}
            data-testid="nav-trade-quote-btn"
          >
            Get a Trade Quote
          </button>
        </div>
      </nav>
    </header>
  );
}
