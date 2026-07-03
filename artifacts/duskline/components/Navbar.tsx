"use client";
import Link from "next/link";
import Wordmark from "./Wordmark";

export default function Navbar() {
  const scrollToForm = () => {
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
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
        <Link href="/" data-testid="nav-home-link">
          <Wordmark size="sm" />
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/quote-builder"
            className="hidden sm:inline-flex"
            style={{ color: "#9A9DA8", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none" }}
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
            className="btn-primary hidden sm:inline-flex"
            style={{ padding: "10px 20px", fontSize: "0.875rem" }}
            data-testid="nav-enquire-btn"
          >
            Enquire for Pricing
          </button>
        </div>
      </nav>
    </header>
  );
}
