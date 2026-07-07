import type { Metadata } from "next";
import Link from "next/link";
import { tradeResources } from "@/lib/tradeResources";

export const metadata: Metadata = {
  title: "Trade Resources | Orenara",
  description:
    "Technical resources for electricians, landscapers, and builders — driver sizing, voltage selection, and IP rating standards for outdoor LED strip lighting.",
  robots: { index: true, follow: true },
};

export default function TradeResourcesHub() {
  return (
    <section style={{ paddingTop: "148px", paddingBottom: "96px" }}>
      <div className="max-w-6xl mx-auto px-6">
        <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
          Trade Resources
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.25rem)",
            color: "var(--bone)",
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            maxWidth: "760px",
          }}
        >
          Technical resources for electricians, landscapers, and builders.
        </h1>
        <p
          style={{
            marginTop: "16px",
            fontSize: "1rem",
            color: "var(--bone-dim)",
            lineHeight: 1.7,
            maxWidth: "620px",
          }}
        >
          Specification detail, sizing logic, and the standards that actually matter — not
          marketing copy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: "48px" }}>
          {tradeResources.map((resource) => (
            <Link
              key={resource.slug}
              href={`/trade-resources/${resource.slug}`}
              className="kit-card rounded-lg p-8 flex flex-col"
              data-testid={`trade-resource-card-${resource.slug}`}
              style={{
                background: "var(--ink-raised)",
                border: "1px solid var(--ink-line)",
                textDecoration: "none",
              }}
            >
              <h2
                style={{
                  fontSize: "1.1875rem",
                  color: "var(--bone)",
                  letterSpacing: "-0.02em",
                  marginBottom: "12px",
                }}
              >
                {resource.title}
              </h2>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--bone-dim)",
                  lineHeight: 1.7,
                  flex: 1,
                  marginBottom: "20px",
                }}
              >
                {resource.blurb}
              </p>
              <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--bone)" }}>
                Read the guide &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
