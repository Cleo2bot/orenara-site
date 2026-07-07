import type { Metadata } from "next";
import Link from "next/link";
import { DRIVER_RATED_WATTS, STRIP_WATTS_PER_METRE, SAFETY_DERATE, MAX_RUN_PER_DRIVER } from "@/lib/quoteCalc";

export const metadata: Metadata = {
  title: "Driver & Dimmer Sizing Guide | Orenara Trade Resources",
  description:
    "Work out driver, dimmer, and plug requirements for any run length — based on real driver capacity and safety derating, not guesswork.",
  robots: { index: true, follow: true },
};

export default function DriverSizingPage() {
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
          Driver & Dimmer Sizing Guide
        </h1>

        <div style={{ marginTop: "36px", fontSize: "1rem", color: "var(--bone-dim)", lineHeight: 1.85 }}>
          <p style={{ marginBottom: "20px" }}>
            A driver&apos;s rated output doesn&apos;t equal its safe continuous output. Running a
            driver at 100% of its rating continuously shortens its life and raises thermal risk —
            proper practice is to derate.
          </p>
          <p style={{ marginBottom: "20px" }}>
            Our drivers are rated at {DRIVER_RATED_WATTS}W. Our strip draws {STRIP_WATTS_PER_METRE}W
            per metre. At an {SAFETY_DERATE * 100}% safety derate, that gives a maximum safe run of{" "}
            {MAX_RUN_PER_DRIVER} metres per driver — not the {DRIVER_RATED_WATTS / STRIP_WATTS_PER_METRE}{" "}
            metres the raw numbers might suggest.
          </p>

          <div
            style={{
              margin: "32px 0",
              padding: "20px 24px",
              borderRadius: "var(--radius)",
              border: "1px solid var(--ink-line)",
              background: "var(--ink-raised)",
            }}
          >
            <p className="spec-mono-upper" style={{ marginBottom: "10px" }}>
              The formula
            </p>
            <p className="spec-mono" style={{ color: "var(--bone)", fontSize: "0.9375rem", lineHeight: 1.8 }}>
              Max safe run (metres) = (Driver rated watts &times; safety derate) &divide; strip watts per metre
              <br />
              {DRIVER_RATED_WATTS}W &times; {SAFETY_DERATE} &divide; {STRIP_WATTS_PER_METRE}W/m = {MAX_RUN_PER_DRIVER}m
            </p>
          </div>

          <p style={{ marginBottom: "20px" }}>
            For runs longer than {MAX_RUN_PER_DRIVER}m, add another driver — don&apos;t push a
            single driver past its safe derated capacity to avoid buying a second one. Dimmers are
            matched 1:1 with drivers by default in our kits.
          </p>
          <p style={{ marginBottom: "20px" }}>
            Use our{" "}
            <Link
              href="/quote-builder"
              style={{ color: "var(--bone)", textDecoration: "underline", textUnderlineOffset: "3px" }}
              data-testid="driver-sizing-quote-builder-link"
            >
              Quote Builder tool
            </Link>{" "}
            to calculate this automatically for a multi-zone job, or enquire directly with your run
            length and we&apos;ll confirm exact requirements.
          </p>
        </div>

        <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid var(--ink-line)" }}>
          <Link
            href="/trade-resources"
            style={{ fontSize: "0.9375rem", color: "var(--bone-dim)", textDecoration: "underline", textUnderlineOffset: "3px" }}
            data-testid="driver-sizing-hub-link"
          >
            See more in Trade Resources
          </Link>
        </div>
      </div>
    </article>
  );
}
