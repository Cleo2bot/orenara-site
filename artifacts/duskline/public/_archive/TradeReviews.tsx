"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronDown } from "lucide-react";

type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
};

type Review = {
  rating: number;
  quote: string;
  role: string;
  state: string;
  verified: string;
  photo?: string;
  photoAlt?: string;
  photoCaption?: string;
  photos?: GalleryPhoto[];
};

const AGGREGATE = 4.7;
const TOTAL_REVIEWS = 23;

const distribution = [
  { stars: 5, pct: 70 },
  { stars: 4, pct: 22 },
  { stars: 3, pct: 6 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 0 },
];

const featured: Review = {
  rating: 5,
  quote:
    "Sealed connectors that actually seal. Ran a length under pool coping, no dramas six months on. Doesn't drop out mid-run like the cheap stuff I used to buy.",
  role: "Electrician",
  state: "QLD",
  verified: "Verified trade order",
};

const reviews: Review[] = [
  {
    rating: 4,
    quote:
      "Good gear, does what it says. Only gripe is the lead time caught me out on one job — had to push the install back a week. Worth building that into your quote to the client up front.",
    role: "Builder",
    state: "NSW",
    verified: "Verified trade order",
  },
  {
    rating: 5,
    quote:
      "Went along a retaining wall and through a garden bed. Curves held fine, no hot spots that I could see.",
    role: "Landscaper",
    state: "VIC",
    verified: "Verified trade order",
  },
  {
    rating: 5,
    quote:
      "Not a tradie, just fussy about this stuff. Had my electrician put it in. Two summers outside now, still looks like day one.",
    role: "Homeowner",
    state: "WA",
    verified: "Verified purchase",
  },
  {
    rating: 4,
    quote:
      "Driver's quiet, which sounds like a small thing until you've had one buzz under a bar counter and had to explain that to a client. Only reason it's not 5 stars is I wish there was a slightly shorter run option for smaller jobs.",
    role: "Electrician",
    state: "SA",
    verified: "Verified trade order",
    photo: "/assets/20260701_180300_1782893962722.jpg",
    photoAlt: "LTSYS 24V flicker-free LED driver",
    photoCaption: "The driver in question — SA electrician's submission.",
  },
  {
    rating: 5,
    quote:
      "Pre-specced kits saved me the back and forth. Strip, driver and dimmer matched already, sparky didn't have any questions.",
    role: "Builder",
    state: "QLD",
    verified: "Verified trade order",
    photo: "/assets/20260609_131451_1782893962724.jpg",
    photoAlt: "LTECH 0-10V wall dimmer controller",
    photoCaption: "Dimmer panel from the same job — QLD builder's submission.",
  },
  {
    rating: 3,
    quote:
      "Product's fine. Delivery quoted at 20 days took closer to 25 for me — not a dealbreaker, just wasn't quite as advertised. Would still use again.",
    role: "Electrician",
    state: "NSW",
    verified: "Verified trade order",
  },
  {
    rating: 5,
    quote:
      "Tested a length in a bucket before I put it in. Genuinely IP68. Flicker-free on the dimmer too. Took a few shots on the job — sealed joins, the cert on the reel, and how tight it curves.",
    role: "Electrician",
    state: "NSW",
    verified: "Verified trade order",
    photos: [
      {
        src: "/assets/20260529_141958_1782893962742.jpg",
        alt: "IP68 certification label on the LED strip",
        caption: "IP68 rating printed on the reel — not a marketing sticker.",
      },
      {
        src: "/assets/20260529_141954_1782893962744.jpg",
        alt: "Sealed IP68 connector detail on the LED strip",
        caption: "Connectors sealed end to end — no way in for water.",
      },
      {
        src: "/assets/20260529_142442_1782893962740.jpg",
        alt: "LED neon flex coiled to show the bend radius",
        caption: "Tight, clean curves with no stress on the diodes.",
      },
      {
        src: "/assets/20260529_142637_1782893962733.jpg",
        alt: "IP68 LED strip and neon flex ready for install",
        caption: "Strip and neon flex specced together off the reel.",
      },
    ],
  },
];

function StarRow({
  rating,
  size = 14,
  label,
}: {
  rating: number;
  size?: number;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  const stars = (color: string, fill?: string) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        style={{ color, flexShrink: 0 }}
        fill={fill ?? "none"}
      />
    ));

  return (
    <span
      style={{ position: "relative", display: "inline-flex" }}
      role="img"
      aria-label={label ?? `Rated ${rating} out of 5 stars`}
    >
      <span style={{ display: "inline-flex", gap: "2px" }}>
        {stars("var(--bone-dim)")}
      </span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${pct}%`,
          overflow: "hidden",
          display: "inline-flex",
          gap: "2px",
        }}
      >
        {stars("var(--bone)", "var(--bone)")}
      </span>
    </span>
  );
}

function Attribution({ review, mono }: { review: Review; mono?: boolean }) {
  if (mono) {
    return (
      <p
        className="spec-mono"
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--bone-dim)",
        }}
      >
        {review.role} · {review.state} · {review.verified}
      </p>
    );
  }
  return (
    <p style={{ fontSize: "0.8rem", color: "var(--bone-dim)" }}>
      <span style={{ color: "var(--bone)", fontWeight: 500 }}>{review.role}</span>
      {" · "}
      {review.state}
      {" · "}
      <span style={{ color: "var(--bone-dim)", fontWeight: 500 }}>{review.verified}</span>
    </p>
  );
}

export default function TradeReviews() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id="trade-reviews" className="mt-14">
      <div className="mb-6">
        <h3
          className="font-medium"
          style={{
            fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)",
            color: "var(--bone)",
            letterSpacing: "-0.02em",
          }}
        >
          More from the trade.
        </h3>
        <p style={{ fontSize: "0.8125rem", color: "var(--bone-dim)", marginTop: "2px" }}>
          What trade customers say once the job&apos;s signed off.
        </p>
      </div>

      {/* Summary header — aggregate score + rating breakdown */}
      <div
        className="rounded-xl"
        style={{
          background: "var(--ink-raised)",
          border: "1px solid var(--ink-line)",
          padding: "clamp(20px, 3vw, 28px)",
        }}
        data-testid="reviews-summary"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-x-10 gap-y-6">
          {/* Score */}
          <div
            className="flex sm:flex-col items-center sm:items-start gap-x-4 gap-y-1"
            style={{ flexShrink: 0 }}
          >
            <span
              className="font-medium"
              style={{
                fontSize: "2.75rem",
                lineHeight: 1,
                color: "var(--bone)",
                letterSpacing: "-0.03em",
              }}
            >
              {AGGREGATE.toFixed(1)}
            </span>
            <div className="flex flex-col gap-1 sm:mt-2">
              <StarRow
                rating={AGGREGATE}
                size={16}
                label={`Rated ${AGGREGATE} out of 5 stars`}
              />
              <span style={{ fontSize: "0.78rem", color: "var(--bone-dim)" }}>
                Based on {TOTAL_REVIEWS} reviews
              </span>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="flex-1 flex flex-col gap-2" style={{ minWidth: 0 }}>
            {distribution.map(({ stars, pct }) => (
              <div key={stars} className="flex items-center gap-3">
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--bone-dim)",
                    width: "26px",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {stars}★
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "6px",
                    borderRadius: "var(--radius)",
                    background: "var(--ink-line)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: "var(--bone-dim)",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--bone-dim)",
                    width: "34px",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured review — large hairline-bordered panel */}
      <figure
        className="mt-5"
        style={{
          background: "var(--ink-raised)",
          border: "1px solid var(--ink-line)",
          borderRadius: "var(--radius)",
          padding: "clamp(28px, 4vw, 44px)",
        }}
        data-testid="featured-review"
      >
        <StarRow rating={featured.rating} size={14} />
        <blockquote
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(1.15rem, 2vw, 1.3rem)",
            color: "var(--bone)",
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
            marginTop: "16px",
            maxWidth: "780px",
          }}
        >
          &ldquo;{featured.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-5">
          <Attribution review={featured} mono />
        </figcaption>
      </figure>

      {/* Expand / collapse */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="all-reviews"
        data-testid="toggle-reviews"
        className="mt-5 inline-flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
        style={{
          fontSize: "0.85rem",
          fontWeight: 500,
          color: "var(--bone)",
          background: "transparent",
          border: "1px solid var(--ink-line)",
          padding: "9px 16px",
          cursor: "pointer",
        }}
      >
        {expanded ? "Hide reviews" : `Show all ${TOTAL_REVIEWS} reviews`}
        <ChevronDown
          size={16}
          aria-hidden="true"
          style={{
            transition: "transform 0.2s ease",
            transform: expanded ? "rotate(180deg)" : "none",
            color: "var(--bone-dim)",
          }}
        />
      </button>

      {/* Expanded stacked feed — dividers, not cards */}
      {expanded && (
        <ul
          id="all-reviews"
          aria-label="All trade reviews"
          className="mt-4"
          style={{ listStyle: "none", margin: 0, padding: 0 }}
        >
          {reviews.map((review, i) => (
            <li
              key={i}
              data-testid={`review-row-${i}`}
              style={{
                padding: "20px 0",
                borderTop: "1px solid var(--ink-line)",
              }}
            >
              <StarRow rating={review.rating} size={13} />
              <blockquote
                style={{
                  fontSize: "0.875rem",
                  color: "var(--bone-dim)",
                  lineHeight: 1.6,
                  marginTop: "10px",
                  maxWidth: "720px",
                }}
              >
                &ldquo;{review.quote}&rdquo;
              </blockquote>

              {review.photo && review.photoAlt && (
                <figure className="mt-3 flex items-start gap-3">
                  <div
                    className="img-treated"
                    style={{
                      width: "150px",
                      flexShrink: 0,
                      aspectRatio: "4 / 3",
                      borderRadius: "var(--radius)",
                      overflow: "hidden",
                      background: "var(--ink)",
                      border: "1px solid var(--ink-line)",
                    }}
                  >
                    <Image
                      src={review.photo}
                      alt={review.photoAlt}
                      fill
                      sizes="150px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  {review.photoCaption && (
                    <figcaption
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--bone-dim)",
                        lineHeight: 1.5,
                        alignSelf: "center",
                      }}
                    >
                      {review.photoCaption}
                    </figcaption>
                  )}
                </figure>
              )}

              {review.photos && review.photos.length > 0 && (
                <div
                  className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2"
                  style={{ maxWidth: "720px" }}
                  data-testid={`review-gallery-${i}`}
                >
                  {review.photos.map((p) => (
                    <figure key={p.src} style={{ margin: 0 }}>
                      <div
                        className="img-treated"
                        style={{
                          aspectRatio: "4 / 3",
                          borderRadius: "var(--radius)",
                          overflow: "hidden",
                          background: "var(--ink)",
                          border: "1px solid var(--ink-line)",
                        }}
                      >
                        <Image
                          src={p.src}
                          alt={p.alt}
                          fill
                          sizes="(max-width: 640px) 50vw, 180px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <figcaption
                        style={{
                          marginTop: "6px",
                          fontSize: "0.72rem",
                          color: "var(--bone-dim)",
                          lineHeight: 1.45,
                        }}
                      >
                        {p.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}

              <div className="mt-3">
                <Attribution review={review} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
