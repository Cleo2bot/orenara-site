import Image from "next/image";
import { Star, BadgeCheck, Quote, Camera } from "lucide-react";
import TradeReviews from "@/components/sections/TradeReviews";

const reviewPhotos = [
  {
    src: "/assets/review-kit-box.jpg",
    label: "The full kit as delivered",
    alt: "Duskline outdoor LED kit as delivered — coiled white IP68 neon-flex strip, LTECH LED driver, 0–10V wall dimmer and 240V plug lead packed in the box",
  },
  {
    src: "/assets/review-ip68-label.jpg",
    label: "IP68 end cap & CE label",
    alt: "Close-up of the sealed IP68 strip end cap with CE marking and 'Do Not Cut' label on the factory-terminated lead",
  },
  {
    src: "/assets/review-driver-flickerfree.jpg",
    label: "Flicker-free LTECH driver",
    alt: "LTECH constant-voltage 24V LED driver labelled Flicker Free to IEEE 1789 with 0–10V and PWM dimming support",
  },
  {
    src: "/assets/review-dimmer.jpg",
    label: "0–10V wall dimmer",
    alt: "LTECH 0–10V touch wall dimmer panel showing 25/50/75/100% brightness scale next to the LED driver",
  },
];

export default function InstallerReview() {
  return (
    <section
      id="review"
      style={{
        background: "#15171C",
        borderTop: "1px solid rgba(91,100,120,0.2)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="mb-12">
          <p className="spec-badge mb-6" style={{ display: "inline-flex" }}>
            From the trade
          </p>
          <h2
            className="font-bold"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "#F4F1EA",
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
            background: "#1F222B",
            border: "1px solid rgba(91,100,120,0.25)",
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
                color: "#F5B25C",
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
                  <Star key={i} size={14} style={{ color: "#F5B25C" }} fill="#F5B25C" />
                ))}
              </div>
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "#F4F1EA",
                  letterSpacing: "0.01em",
                }}
              >
                5.0
              </span>
              <span
                className="inline-flex items-center gap-1.5"
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#F5B25C",
                  background: "rgba(245,178,92,0.08)",
                  border: "1px solid rgba(245,178,92,0.22)",
                  padding: "3px 9px",
                  borderRadius: "999px",
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
                color: "#C9CCD4",
                lineHeight: 1.65,
                letterSpacing: "-0.005em",
                maxWidth: "760px",
              }}
            >
              <p>
                &ldquo;I install a lot of &lsquo;outdoor strip&rsquo; and most of
                it I end up replacing after it gets wet. This is the first lot
                I&apos;ve put in that I&apos;m genuinely not worried about.
                Definietly, IP68 submersible, strip and end caps, tested it in a
                bucket! Doesn&apos;t flicker or drop over the run. RCM, CE gear.
                Flexible and straight conduit, easy install. Curves where easy
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
                borderTop: "1px solid rgba(91,100,120,0.2)",
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(245,178,92,0.1)",
                    border: "1px solid rgba(245,178,92,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                    color: "#F5B25C",
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
                    color: "#F5B25C",
                    background: "#1F222B",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "#F4F1EA",
                  }}
                >
                  Licensed electrical installer
                </p>
                <p style={{ fontSize: "0.78rem", color: "#9A9DA8" }}>
                  Brisbane, QLD · Verified install
                </p>
              </div>
            </div>

            {/* Verified customer photos */}
            <div
              className="mt-8"
              style={{
                paddingTop: "22px",
                borderTop: "1px solid rgba(91,100,120,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Camera size={14} style={{ color: "#F5B25C" }} aria-hidden="true" />
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: "#9A9DA8",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Photos from a verified trade delivery
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {reviewPhotos.map((photo) => (
                  <figure key={photo.src} style={{ margin: 0 }}>
                    <div
                      style={{
                        position: "relative",
                        aspectRatio: "4 / 3",
                        borderRadius: "10px",
                        overflow: "hidden",
                        border: "1px solid rgba(91,100,120,0.25)",
                        background: "#15171C",
                      }}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 45vw, 220px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <figcaption
                      style={{
                        marginTop: "8px",
                        fontSize: "0.72rem",
                        color: "#9A9DA8",
                        lineHeight: 1.35,
                      }}
                    >
                      {photo.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* More reviews — aggregate summary + expandable feed */}
        <TradeReviews />
      </div>
    </section>
  );
}
