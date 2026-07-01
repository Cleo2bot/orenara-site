"use client";

import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { Star, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";

const anonReviews = [
  {
    trade: "Electrician",
    location: "QLD",
    quote:
      "Sealed connectors that actually seal. Ran it under pool coping, no dramas six months on. Doesn't drop out mid-run like the cheap stuff.",
  },
  {
    trade: "Electrician",
    location: "NSW",
    quote:
      "Tested a length in a bucket before I put it in — genuinely IP68, strip and end caps. Flicker-free on the dimmer too. This is what I run now.",
  },
  {
    trade: "Landscaper",
    location: "VIC",
    quote:
      "Went along a retaining wall and through a garden bed. Curves clean, no hotspots, client couldn't be happier. Lead time landed exactly when they said.",
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
  {
    trade: "Electrician",
    location: "SA",
    quote:
      "Consistent brightness the whole run, even on the long lengths. Drivers don't buzz. Little things, but it's why I stopped shopping around.",
  },
];

export default function AnonReviewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Respect reduced motion — start paused if the user prefers it.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setPaused(true);
  }, []);

  // Pause autoplay while the carousel is scrolled out of view (saves CPU/battery).
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Continuous auto-scroll (fast but readable). Loops seamlessly using the duplicated list.
  // Time-based so perceived speed is consistent across 60/120/144Hz displays.
  useEffect(() => {
    if (paused || !visible) return;
    let raf = 0;
    let last = 0;
    const pxPerSecond = 66;
    const step = (now: number) => {
      const el = trackRef.current;
      if (el) {
        const dt = last ? (now - last) / 1000 : 0;
        el.scrollLeft += pxPerSecond * dt;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      }
      last = now;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [paused, visible]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollByCard(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollByCard(-1);
      }
    },
    // scrollByCard is defined below and stable via useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const scrollByCard = useCallback((dir: 1 | -1) => {
    setPaused(true);
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const items = [...anonReviews, ...anonReviews];

  return (
    <div className="mt-14">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3
            className="font-bold"
            style={{
              fontSize: "clamp(1.05rem, 1.8vw, 1.25rem)",
              color: "#F4F1EA",
              letterSpacing: "-0.02em",
            }}
          >
            More from the trade.
          </h3>
          <p style={{ fontSize: "0.8125rem", color: "#9A9DA8", marginTop: "2px" }}>
            Names hidden by request — no forms, just the verdict.
          </p>
        </div>

        <div className="flex items-center gap-2" aria-hidden="false">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous reviews"
            data-testid="reviews-prev"
            className="carousel-arrow"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next reviews"
            data-testid="reviews-next"
            className="carousel-arrow"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar flex gap-5 overflow-x-auto rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F5B25C]"
        style={{ scrollBehavior: "auto" }}
        role="region"
        aria-label="Customer reviews carousel — use left and right arrow keys to scroll"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {items.map((review, i) => (
          <div
            key={i}
            aria-hidden={i >= anonReviews.length ? "true" : undefined}
            style={{
              flexShrink: 0,
              width: "clamp(240px, 72vw, 300px)",
              background: "#1A1D24",
              border: "1px solid rgba(91,100,120,0.2)",
              borderRadius: "12px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
            }}
            data-testid={i < anonReviews.length ? `anon-review-${i}` : undefined}
          >
            <div
              className="flex items-center gap-0.5 mb-3"
              role="img"
              aria-label="Rated 5 out of 5 stars"
            >
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={13} style={{ color: "#F5B25C" }} fill="#F5B25C" />
              ))}
            </div>

            <blockquote
              style={{
                fontSize: "0.875rem",
                color: "#C9CCD4",
                lineHeight: 1.6,
                flexGrow: 1,
              }}
            >
              &ldquo;{review.quote}&rdquo;
            </blockquote>

            <div
              className="mt-4 flex items-center gap-2.5"
              style={{ paddingTop: "12px", borderTop: "1px solid rgba(91,100,120,0.18)" }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "rgba(91,100,120,0.15)",
                  border: "1px solid rgba(91,100,120,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <EyeOff size={13} aria-hidden="true" style={{ color: "#9A9DA8" }} />
              </div>
              <p
                className="inline-flex items-center gap-1.5"
                style={{ fontSize: "0.78rem", color: "#9A9DA8", minWidth: 0 }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "#F5B25C",
                    background: "rgba(245,178,92,0.08)",
                    border: "1px solid rgba(245,178,92,0.22)",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {review.trade}
                </span>
                <span>· {review.location}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
