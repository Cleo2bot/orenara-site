import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IP54 vs IP65 vs IP68 Explained | Orenara Trade Resources",
  description:
    "What the ingress protection scale actually means, and why the second digit is the one that matters for outdoor lighting.",
  robots: { index: true, follow: true },
};

export default function IpRatingsPage() {
  return (
    <article style={{ paddingTop: "148px", paddingBottom: "96px" }}>
      <div className="mx-auto px-6" style={{ maxWidth: "760px" }}>
        <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
          Trade Resources
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--bone)",
            letterSpacing: "-0.03em",
            lineHeight: 1.12,
          }}
        >
          IP54, IP65, IP68 — What the Second Digit Means
        </h1>

        <div style={{ marginTop: "36px", fontSize: "1rem", color: "var(--bone-dim)", lineHeight: 1.85 }}>
          <p style={{ marginBottom: "20px" }}>
            IP ratings have two digits: the first covers dust/solid ingress, the second covers
            water ingress. For outdoor lighting, the second digit is the one that actually
            determines whether a product survives.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "28px 0" }}>
            <div style={{ padding: "18px 20px", borderRadius: "var(--radius)", border: "1px solid var(--ink-line)", background: "var(--ink-raised)" }}>
              <p className="spec-mono-upper" style={{ color: "var(--bone)", marginBottom: "6px" }}>IP54</p>
              <p style={{ color: "var(--bone-dim)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
                Protected against dust ingress (not dust-tight) and splashing water from any
                direction. Adequate for a covered, sheltered spot. Not adequate for a garden bed, a
                pool edge, or anywhere it sits in standing water.
              </p>
            </div>
            <div style={{ padding: "18px 20px", borderRadius: "var(--radius)", border: "1px solid var(--ink-line)", background: "var(--ink-raised)" }}>
              <p className="spec-mono-upper" style={{ color: "var(--bone)", marginBottom: "6px" }}>IP65</p>
              <p style={{ color: "var(--bone-dim)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
                Dust-tight, protected against low-pressure water jets. Better, but still not rated
                for submersion.
              </p>
            </div>
            <div style={{ padding: "18px 20px", borderRadius: "var(--radius)", border: "1px solid var(--ink-line)", background: "var(--ink-raised)" }}>
              <p className="spec-mono-upper" style={{ color: "var(--bone)", marginBottom: "6px" }}>IP68</p>
              <p style={{ color: "var(--bone-dim)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
                Dust-tight and rated for continuous submersion at a specified depth and duration
                (Orenara&apos;s components: 1.5m for 30 minutes). This is the rating that actually
                matters for pool edges, garden irrigation zones, and anywhere water contact is
                constant rather than occasional.
              </p>
            </div>
          </div>

          <p style={{ marginBottom: "20px" }}>
            The gap between IP65 and IP68 isn&apos;t marginal — it&apos;s the difference between
            &ldquo;resists rain&rdquo; and &ldquo;survives being underwater.&rdquo; Check the second
            digit before assuming a product will hold up outdoors.
          </p>
        </div>

        <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid var(--ink-line)" }}>
          <Link
            href="/trade-resources"
            style={{ fontSize: "0.9375rem", color: "var(--bone-dim)", textDecoration: "underline", textUnderlineOffset: "3px" }}
            data-testid="ip-ratings-hub-link"
          >
            See more in Trade Resources
          </Link>
        </div>
      </div>
    </article>
  );
}
