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
        background: "linear-gradient(180deg, rgba(21,23,28,0.95) 0%, rgba(21,23,28,0.0) 100%)",
        backdropFilter: "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }} aria-label="Duskline home">
            <Wordmark size="sm" />
          </Link>
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "#F5B25C",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              border: "1px solid rgba(245,178,92,0.35)",
              borderRadius: "4px",
              padding: "2px 7px",
            }}
          >
            Trade
          </span>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/quote-builder"
            className="hidden sm:inline-flex"
            style={{
              color: "#9A9DA8",
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
              color: "#9A9DA8",
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
            className="btn-primary hidden sm:inline-flex"
            style={{ padding: "10px 20px", fontSize: "0.875rem" }}
            data-testid="nav-trade-quote-btn"
          >
            Get a Trade Quote
          </button>
        </div>
      </nav>
    </header>
  );
}
