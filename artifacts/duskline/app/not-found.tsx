import type { Metadata } from "next";
import Link from "next/link";
import Wordmark from "@/components/Wordmark";

export const metadata: Metadata = {
  title: "Page Not Found — Orenara",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--ink)" }}
    >
      <header
        className="px-6 py-5"
        style={{ borderBottom: "1px solid var(--ink-line)" }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Wordmark size="sm" />
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center" style={{ maxWidth: "480px" }}>
          <p className="spec-mono-upper" style={{ marginBottom: "24px" }}>
            Error 404 · Page not found
          </p>
          <h1
            className="font-medium"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              color: "var(--bone)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            This page doesn&apos;t exist.
          </h1>
          <p
            style={{
              marginTop: "16px",
              fontSize: "1rem",
              color: "var(--bone-dim)",
              lineHeight: 1.7,
            }}
          >
            The address may have changed, or the link you followed is out of
            date.
          </p>
          <div style={{ marginTop: "40px" }}>
            <Link
              href="/"
              className="spec-mono-upper"
              data-testid="notfound-home-link"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                border: "1px solid var(--ink-line)",
                borderRadius: "var(--radius)",
                color: "var(--bone)",
                textDecoration: "none",
              }}
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
