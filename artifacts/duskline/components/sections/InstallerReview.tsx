import Image from "next/image";
import { Star, BadgeCheck, Quote, EyeOff } from "lucide-react";

const anonReviews = [
  {
    trade: "Electrician",
    location: "QLD",
    quote:
      "Sealed connectors that actually seal. Ran it under pool coping, no dramas six months on. Doesn't drop out mid-run like the cheap stuff I keep getting called back to replace.",
  },
  {
    trade: "Electrician",
    location: "NSW",
    quote:
      "Tested a length in a bucket before I put it in — genuinely IP68, strip and end caps. Flicker-free on the dimmer too. This is what I run now, full stop.",
  },
  {
    trade: "Landscaper",
    location: "VIC",
    quote:
      "Went along a retaining wall and through a garden bed. Curves clean, no hotspots, client couldn't be happier. Lead time landed exactly when they said it would.",
  },
  {
    trade: "Builder",
    location: "QLD",
    quote:
      "Pre-specced kits meant a lot less mucking around on site. Strip, driver and dimmer all matched out of the box, sparky signed it off no questions.",
  },
  {
    trade: "Homeowner",
    location: "WA",
    quote:
      "Not a tradie, just fussy. Got my electrician to put it in. Two summers outside now and it looks the same as day one. No dead sections, no colour drift.",
  },
];

const photos = [
  {
    src: "/assets/20260529_141958_1782893962742.jpg",
    alt: "IP68 certification label on the LED strip",
  },
  {
    src: "/assets/20260529_141954_1782893962744.jpg",
    alt: "Sealed IP68 connector detail on the LED strip",
  },
  {
    src: "/assets/20260529_142442_1782893962740.jpg",
    alt: "LED neon flex coiled to show the bend radius",
  },
  {
    src: "/assets/20260529_142637_1782893962733.jpg",
    alt: "IP68 LED strip and neon flex ready for install",
  },
  {
    src: "/assets/20260701_180300_1782893962722.jpg",
    alt: "LTSYS 24V flicker-free LED driver",
  },
  {
    src: "/assets/20260609_131451_1782893962724.jpg",
    alt: "LTECH 0-10V wall dimmer controller",
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
          <div className="p-8 md:p-12" style={{ position: "relative" }}>
            {/* Decorative quote mark */}
            <Quote
              aria-hidden="true"
              size={80}
              style={{
                position: "absolute",
                top: "24px",
                right: "28px",
                color: "#F5B25C",
                opacity: 0.08,
                transform: "scaleX(-1)",
                pointerEvents: "none",
              }}
            />

            {/* Rating row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-7">
              <div
                className="flex items-center gap-1"
                role="img"
                aria-label="Rated 5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} style={{ color: "#F5B25C" }} fill="#F5B25C" />
                ))}
              </div>
              <span
                style={{
                  fontSize: "0.9375rem",
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
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#F5B25C",
                  background: "rgba(245,178,92,0.08)",
                  border: "1px solid rgba(245,178,92,0.22)",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  letterSpacing: "0.02em",
                }}
              >
                <BadgeCheck size={13} aria-hidden="true" />
                Verified trade customer
              </span>
            </div>

            {/* Quote */}
            <blockquote
              style={{
                fontSize: "clamp(1rem, 1.4vw, 1.1875rem)",
                color: "#E8E6DF",
                lineHeight: 1.7,
                letterSpacing: "-0.005em",
                maxWidth: "820px",
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
              className="mt-8 flex items-center gap-3"
              style={{
                paddingTop: "24px",
                borderTop: "1px solid rgba(91,100,120,0.2)",
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "rgba(245,178,92,0.1)",
                    border: "1px solid rgba(245,178,92,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#F5B25C",
                    letterSpacing: "0.03em",
                  }}
                >
                  QLD
                </div>
                <BadgeCheck
                  size={18}
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
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#F4F1EA",
                  }}
                >
                  Licensed electrical installer
                </p>
                <p style={{ fontSize: "0.85rem", color: "#9A9DA8" }}>
                  Brisbane, QLD · Verified install
                </p>
              </div>
            </div>
          </div>

          {/* Installer's photos — horizontal scroll */}
          <div
            style={{
              borderTop: "1px solid rgba(91,100,120,0.2)",
              padding: "24px 0 28px",
              background: "#15171C",
            }}
          >
            <div className="flex items-center justify-between px-6 md:px-8 mb-4">
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "#9A9DA8",
                  fontWeight: 500,
                }}
              >
                Photos supplied by the installer
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#5B6478",
                }}
              >
                Scroll for more →
              </p>
            </div>
            <div
              className="flex gap-3 overflow-x-auto px-6 md:px-8 pb-2"
              role="region"
              aria-label="Scrollable gallery of photos supplied by the installer"
              tabIndex={0}
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden"
                  style={{
                    position: "relative",
                    flexShrink: 0,
                    width: "clamp(180px, 44vw, 232px)",
                    aspectRatio: "1 / 1",
                    background: "#1F222B",
                    border: "1px solid rgba(91,100,120,0.2)",
                    scrollSnapAlign: "start",
                  }}
                  data-testid={`review-photo-${i}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="232px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* More reviews — anonymous */}
        <div className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-6">
            <h3
              className="font-bold"
              style={{
                fontSize: "clamp(1.125rem, 2vw, 1.375rem)",
                color: "#F4F1EA",
                letterSpacing: "-0.02em",
              }}
            >
              More from the trade.
            </h3>
            <p style={{ fontSize: "0.8125rem", color: "#9A9DA8" }}>
              Names hidden by request — no forms, just the verdict.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {anonReviews.map((review, i) => (
              <div
                key={i}
                className="rounded-xl"
                style={{
                  background: "#1F222B",
                  border: "1px solid rgba(91,100,120,0.25)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                }}
                data-testid={`anon-review-${i}`}
              >
                {/* Rating */}
                <div
                  className="flex items-center gap-1 mb-4"
                  role="img"
                  aria-label="Rated 5 out of 5 stars"
                >
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={15} style={{ color: "#F5B25C" }} fill="#F5B25C" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote
                  style={{
                    fontSize: "0.9375rem",
                    color: "#E8E6DF",
                    lineHeight: 1.65,
                    flexGrow: 1,
                  }}
                >
                  &ldquo;{review.quote}&rdquo;
                </blockquote>

                {/* Attribution — anonymous */}
                <div
                  className="mt-5 flex items-center gap-3"
                  style={{
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(91,100,120,0.2)",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      background: "rgba(91,100,120,0.15)",
                      border: "1px solid rgba(91,100,120,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <EyeOff size={16} aria-hidden="true" style={{ color: "#9A9DA8" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#F4F1EA",
                      }}
                    >
                      Anonymous
                    </p>
                    <p
                      className="inline-flex items-center gap-1.5"
                      style={{ fontSize: "0.8rem", color: "#9A9DA8" }}
                    >
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          color: "#F5B25C",
                          background: "rgba(245,178,92,0.08)",
                          border: "1px solid rgba(245,178,92,0.22)",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {review.trade}
                      </span>
                      <span>· {review.location}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
