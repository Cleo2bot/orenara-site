import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import Footer from "@/components/sections/Footer";
import KitWorkedExample from "@/components/sections/KitWorkedExample";
import { getKitBySlug, kits } from "@/lib/kits";

export function generateStaticParams() {
  return kits.map((kit) => ({ slug: kit.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const kit = getKitBySlug(params.slug);
  if (!kit) {
    return { title: "Kit not found — Orenara" };
  }
  return {
    title: `${kit.name} — Full Specifications | Orenara`,
    description: kit.description,
    robots: { index: true, follow: true },
  };
}

export default function KitDetailPage({ params }: { params: { slug: string } }) {
  const kit = getKitBySlug(params.slug);
  if (!kit) {
    notFound();
  }

  return (
    <main style={{ background: "var(--ink)", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto px-6" style={{ paddingTop: "48px", paddingBottom: "96px" }}>
        <div style={{ marginBottom: "40px" }}>
          <Link href="/" style={{ display: "inline-block", marginBottom: "24px" }}>
            <Wordmark />
          </Link>
          <Link
            href="/#kits"
            data-testid="kit-back-link"
            style={{ fontSize: "0.875rem", color: "var(--bone-dim)", textDecoration: "underline" }}
          >
            ← Back to all kits
          </Link>
        </div>

        {/* Hero image */}
        <div
          className="img-treated"
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            borderRadius: "2px",
            marginBottom: "32px",
          }}
        >
          <Image src={kit.image} alt={kit.name} fill sizes="100vw" style={{ objectFit: "cover" }} />
        </div>

        <p className="spec-badge mb-4" style={{ display: "inline-flex" }}>
          Pre-specced kit
        </p>
        <h1
          className="font-medium"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "var(--bone)",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "8px",
          }}
        >
          {kit.name}
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--bone)", fontWeight: 500, marginBottom: "24px" }}>
          {kit.tagline}
        </p>

        <p style={{ fontSize: "1rem", color: "var(--bone-dim)", lineHeight: 1.8, marginBottom: "32px", maxWidth: "680px" }}>
          {kit.longDescription}
        </p>

        {kit.note && (
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--bone-dim)",
              lineHeight: 1.6,
              marginBottom: "32px",
              padding: "14px 16px",
              background: "var(--ink-raised)",
              borderRadius: "2px",
              borderLeft: "2px solid var(--ink-line)",
              maxWidth: "680px",
            }}
          >
            {kit.note}
          </p>
        )}

        {/* Spec table */}
        <h2
          className="font-medium"
          style={{ fontSize: "1.25rem", color: "var(--bone)", marginBottom: "16px", letterSpacing: "-0.02em" }}
        >
          Full Specifications
        </h2>
        <div style={{ overflowX: "auto", marginBottom: "32px" }}>
          <table
            data-testid="kit-spec-table"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
              color: "var(--bone-dim)",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ink-line)" }}>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--bone)", fontWeight: 500 }}>
                  Component
                </th>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--bone)", fontWeight: 500 }}>
                  Orenara Part No.
                </th>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "var(--bone)", fontWeight: 500 }}>
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {kit.specTable.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--ink-line)" }}>
                  <td style={{ padding: "10px 12px" }}>{row.item}</td>
                  <td className="spec-mono" style={{ padding: "10px 12px", color: "var(--bone)" }}>
                    {row.partNumber}
                  </td>
                  <td style={{ padding: "10px 12px" }}>{row.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick specs chips */}
        <div className="flex flex-wrap gap-2" style={{ marginBottom: "40px" }}>
          {kit.specs.map((spec, j) => (
            <span
              key={j}
              className="spec-mono-upper"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                color: "var(--bone-dim)",
                background: "transparent",
                border: "1px solid var(--ink-line)",
                padding: "4px 10px",
                borderRadius: "2px",
              }}
            >
              {spec}
            </span>
          ))}
        </div>

        {kit.slug === "pathway-kit" ? (
          <>
            <KitWorkedExample />

            {/* Start your quote — Phase 2 pilot (Pathway) */}
            <div
              style={{
                paddingTop: "40px",
                borderTop: "1px solid var(--ink-line)",
              }}
            >
              <h2
                className="font-medium"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 1.625rem)",
                  color: "var(--bone)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  marginBottom: "12px",
                }}
              >
                Start your quote.
              </h2>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--bone-dim)",
                  lineHeight: 1.7,
                  marginBottom: "28px",
                  maxWidth: "580px",
                }}
              >
                Tell us your lengths and where the power is. We&apos;ll spec the rest and come back with a firm price — every system is built to order, allow up to 20 business days from order confirmation.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/quote-builder?kit=${kit.slug}`}
                  className="btn-primary"
                  data-testid="kit-detail-start-quote-btn"
                >
                  Start your quote
                </Link>
                <Link
                  href="/#enquire"
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--bone-dim)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                  data-testid="kit-detail-enquire-link"
                >
                  or enquire for pricing
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Link href="/#enquire" className="btn-outline" data-testid="kit-detail-enquire-btn">
              Enquire for Pricing
            </Link>
            <Link href="/quote-builder" className="btn-outline" data-testid="kit-detail-quote-builder-btn">
              Open Quote Builder
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
