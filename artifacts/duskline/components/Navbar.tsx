"use client";
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
        <Wordmark size="sm" />
        <button
          onClick={scrollToForm}
          className="btn-primary hidden sm:inline-flex"
          style={{ padding: "10px 20px", fontSize: "0.875rem" }}
          data-testid="nav-enquire-btn"
        >
          Enquire for Pricing
        </button>
      </nav>
    </header>
  );
}
