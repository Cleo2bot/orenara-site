"use client";
import Link from "next/link";
import Wordmark from "./Wordmark";

export default function Navbar() {
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
          style={{ textDecoration: "none", display: "inline-flex" }}
          data-testid="nav-home-link"
        >
          <Wordmark size="sm" />
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/trade"
            className="hidden md:inline-flex whitespace-nowrap"
            style={{
              color: "var(--bone-dim)",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
            }}
            data-testid="nav-trade-link"
          >
            Trade Order
          </Link>
          <Link
            href="/quote-builder"
            className="btn-outline w-auto whitespace-nowrap"
            style={{ padding: "10px 18px", fontSize: "0.8125rem" }}
            data-testid="nav-quote-builder-link"
          >
            Build Your Kit
          </Link>
        </div>
      </nav>
    </header>
  );
}
