"use client";
import Link from "next/link";
import Wordmark from "./Wordmark";

export default function Navbar() {
  const scrollToForm = () => {
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-ink border-b border-ink-line"
    >
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" data-testid="nav-home-link">
          <Wordmark size="sm" />
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/quote-builder"
            className="hidden sm:inline-flex text-bone-dim text-sm font-medium no-underline whitespace-nowrap"
            data-testid="nav-quote-builder-link"
          >
            Build Your Kit
          </Link>
          <Link
            href="/trade"
            className="btn-trade hidden sm:inline-flex"
            data-testid="nav-trade-link"
          >
            Trade Order
          </Link>
          <button
            onClick={scrollToForm}
            className="btn-outline hidden sm:inline-flex w-auto"
            style={{ padding: "9px 18px", fontSize: "0.8125rem" }}
            data-testid="nav-enquire-btn"
          >
            Enquire for Pricing
          </button>
        </div>
      </nav>
    </header>
  );
}
