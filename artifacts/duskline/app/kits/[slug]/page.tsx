import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import Footer from "@/components/sections/Footer";
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
    <main style={{ background: "#15171C", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto px-6" style={{ paddingTop: "48px", paddingBottom: "96px" }}>
        <div style={{ marginBottom: "40px" }}>
          <Link href="/" style={{ display: "inline-block", marginBottom: "24px" }}>
            <Wordmark />
          </Link>
          <Link
            href="/#kits"
            data-testid="kit-back-link"
            style={{ fontSize: "0.875rem", color: "#9A9DA8", textDecoration: "underline" }}
          >
            ← Back to all kits
          </Link>
        </div>

        {/* Hero image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            borderRadius: "8px",
            marginBottom: "32px",
          }}
        >
          <Image src={kit.image} alt={kit.name} fill sizes="100vw" style={{ objectFit: "cover" }} />
        </div>

        <p className="spec-badge mb-4" style={{ display: "inline-flex" }}>
          Pre-specced kit
        </p>
        <h1
          className="font-bold"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "#F4F1EA",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "8px",
          }}
        >
          {kit.name}
        </h1>
        <p style={{ fontSize: "1rem", color: "#F5B25C", fontWeight: 500, marginBottom: "24px" }}>
          {kit.tagline}
        </p>

        <p style={{ fontSize: "1rem", color: "#9A9DA8", lineHeight: 1.8, marginBottom: "32px", maxWidth: "680px" }}>
          {kit.longDescription}
        </p>

        {kit.note && (
          <p
            style={{
              fontSize: "0.875rem",
              color: "#5B6478",
              lineHeight: 1.6,
              marginBottom: "32px",
              padding: "14px 16px",
              background: "rgba(91,100,120,0.1)",
              borderRadius: "4px",
              borderLeft: "2px solid rgba(91,100,120,0.4)",
              maxWidth: "680px",
            }}
          >
            {kit.note}
          </p>
        )}

        {/* Spec table */}
        <h2
          className="font-bold"
          style={{ fontSize: "1.25rem", color: "#F4F1EA", marginBottom: "16px", letterSpacing: "-0.02em" }}
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
              color: "#9A9DA8",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(91,100,120,0.35)" }}>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "#F4F1EA", fontWeight: 600 }}>
                  Component
                </th>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "#F4F1EA", fontWeight: 600 }}>
                  Orenara Part No.
                </th>
                <th style={{ textAlign: "left", padding: "10px 12px", color: "#F4F1EA", fontWeight: 600 }}>
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {kit.specTable.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(91,100,120,0.15)" }}>
                  <td style={{ padding: "10px 12px" }}>{row.item}</td>
                  <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "#F5B25C" }}>
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
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#9A9DA8",
                background: "rgba(91,100,120,0.15)",
                border: "1px solid rgba(91,100,120,0.25)",
                padding: "4px 10px",
                borderRadius: "4px",
              }}
            >
              {spec}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link href={`/#enquire`} className="btn-outline" data-testid="kit-detail-enquire-btn">
            Enquire for Pricing
          </Link>
          <Link href="/quote-builder" className="btn-outline" data-testid="kit-detail-quote-builder-btn">
            Open Quote Builder
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
