import { Star, BadgeCheck, Quote } from "lucide-react";
import TradeReviews from "@/components/sections/TradeReviews";
import ReviewPhotos from "@/components/sections/ReviewPhotos";

export default function InstallerReview() {
  return (
    <section
      id="review"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="eyebrow mb-6">From the trade</p>
          <h2
            className="font-medium"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "var(--bone)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              maxWidth: "640px",
            }}
          >
            What a licensed installer actually thinks.
          </h2>
        </div>

        {/* Review card */}
        <div
          className="rounded-xl"
          style={{
            background: "var(--ink-raised)",
            border: "1px solid var(--ink-line)",
            overflow: "hidden",
          }}
          data-testid="installer-review"
        >
          <div className="p-6 md:p-8" style={{ position: "relative" }}>
            {/* Decorative quote mark */}
            <Quote
              aria-hidden="true"
              size={56}
              style={{
                position: "absolute",
                top: "20px",
                right: "22px",
                color: "var(--bone-dim)",
                opacity: 0.08,
                transform: "scaleX(-1)",
                pointerEvents: "none",
              }}
            />

            {/* Rating row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
              <div
                className="flex items-center gap-0.5"
                role="img"
                aria-label="Rated 5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} style={{ color: "var(--bone)" }} fill="var(--bone)" />
                ))}
              </div>
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--bone)",
                  letterSpacing: "0.01em",
                }}
              >
                5.0
              </span>
              <span
                className="inline-flex items-center gap-1.5"
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "var(--bone-dim)",
                  background: "transparent",
                  border: "1px solid var(--ink-line)",
                  padding: "3px 9px",
                  borderRadius: "var(--radius)",
                  letterSpacing: "0.02em",
                }}
              >
                <BadgeCheck size={12} aria-hidden="true" />
                Verified trade customer
              </span>
            </div>

            {/* Quote */}
            <blockquote
              style={{
                fontSize: "0.9375rem",
                color: "var(--bone-dim)",
                lineHeight: 1.65,
                letterSpacing: "-0.005em",
                maxWidth: "760px",
              }}
            >
              <p>
                &ldquo;I install a lot of &lsquo;outdoor strip&rsquo; and most of
                it I end up replacing after it gets wet. This is the first lot
                I&apos;ve put in that I&apos;m genuinely not worried about.
                Definitely, IP68 submersible, strip and end caps, tested it in a
                bucket! Doesn&apos;t flicker or drop over the run. RCM, CE gear.
                Flexible and straight conduit, easy install. Curves were easy
                and clean.
              </p>
              <p style={{ marginTop: "1rem" }}>
                Did take 3 weeks for onsite delivery, for a run of 6 strips, 2
                drivers, 2 dimmers, and 240V plugs, but was told and expecting 4
                weeks, so that works for me.&rdquo;
              </p>
            </blockquote>

            {/* Attribution — no name */}
            <div
              className="mt-6 flex items-center gap-3"
              style={{
                paddingTop: "18px",
                borderTop: "1px solid var(--ink-line)",
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  className="spec-mono-upper"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "var(--ink-raised)",
                    border: "1px solid var(--ink-line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  QLD
                </div>
                <BadgeCheck
                  size={15}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: "-3px",
                    right: "-3px",
                    color: "var(--bone-dim)",
                    background: "var(--ink-raised)",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--bone)",
                  }}
                >
                  Licensed electrical installer
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--bone-dim)" }}>
                  Brisbane, QLD · Verified install
                </p>
              </div>
            </div>

            {/* Verified customer photos */}
            <ReviewPhotos />
          </div>

        </div>

        {/* More reviews — aggregate summary + expandable feed */}
        <TradeReviews />
      </div>
    </section>
  );
}
