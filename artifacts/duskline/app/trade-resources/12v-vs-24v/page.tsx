import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "12V vs 24V Outdoor LED Strip — Why It Matters | Orenara Trade Resources",
  description:
    "Voltage drop, injection points, and why 24V systems handle longer outdoor runs better than 12V.",
  robots: { index: true, follow: true },
};

export default function VoltageComparisonPage() {
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
          12V vs 24V — Why It Matters Past 5 Metres
        </h1>

        <div style={{ marginTop: "36px", fontSize: "1rem", color: "var(--bone-dim)", lineHeight: 1.85 }}>
          <p style={{ marginBottom: "20px" }}>
            Lower-voltage systems suffer worse voltage drop over distance than higher-voltage
            systems carrying the same power. In practice, that means a 12V strip needs more
            frequent power injection points to maintain even brightness across a long run — miss
            that, and you get visible dimming toward the far end of the strip, even though nothing
            is faulty.
          </p>
          <p style={{ marginBottom: "20px" }}>
            24V systems handle meaningfully longer continuous runs before voltage drop becomes
            visible, which is why architectural and commercial-grade lighting is built around 24V,
            not 12V, wherever runs exceed a few metres.
          </p>
          <p style={{ marginBottom: "20px" }}>
            Orenara&apos;s strip runs on 24V for exactly this reason — fewer injection points, more
            consistent brightness across the full run length, less complexity on install.
          </p>
        </div>

        <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid var(--ink-line)" }}>
          <Link
            href="/trade-resources"
            style={{ fontSize: "0.9375rem", color: "var(--bone-dim)", textDecoration: "underline", textUnderlineOffset: "3px" }}
            data-testid="voltage-hub-link"
          >
            See more in Trade Resources
          </Link>
        </div>
      </div>
    </article>
  );
}
