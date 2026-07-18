"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type GallerySlide = {
  src: string;
  alt: string;
};

const slides: GallerySlide[] = [
  {
    src: "/images/gallery/orenara-pool-dusk.webp",
    alt: "Outdoor pool at dusk with warm Orenara LED strip lighting glowing along the pool coping",
  },
  {
    src: "/images/gallery/orenara-lap-pool-luxury.webp",
    alt: "Luxury home lap pool at night with continuous LED strip lighting along the pool edge",
  },
  {
    src: "/images/gallery/orenara-rooftop-pool-city.webp",
    alt: "Rooftop pool installation with city skyline — Orenara LED strip lighting integrated into pool coping",
  },
  {
    src: "/images/gallery/orenara-travertine-pool-edge.webp",
    alt: "Travertine pool edge with Orenara LED strip lighting running beneath the coping, warm glow on water",
  },
  {
    src: "/images/gallery/orenara-curved-travertine-pool.webp",
    alt: "Curved travertine pool installation with continuous LED strip following the pool edge radius",
  },
  {
    src: "/images/gallery/orenara-step-edge-night.webp",
    alt: "Step edge lighting at night — Orenara LED strip running beneath step nosings, casting warm wash",
  },
  {
    src: "/images/gallery/orenara-waterfall-rockpond.webp",
    alt: "Waterfall and rock pond feature at night with Orenara LED strip integrated into the rockwork",
  },
  {
    src: "/images/gallery/orenara-courtyard-patio.webp",
    alt: "Courtyard patio with Orenara LED strip lighting installed along the paved edge at night",
  },
  {
    src: "/images/gallery/orenara-curved-granite-edge.webp",
    alt: "Curved granite edge installation — Orenara flexible segmented track following the garden radius",
  },
  {
    src: "/images/gallery/orenara-garden-rockbed.webp",
    alt: "Garden rock bed wall with Orenara LED strip lighting installed along the base, illuminating the rockwork",
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export default function Gallery() {
  const reducedMotion = usePrefersReducedMotion();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        emblaApi.scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        emblaApi.scrollNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emblaApi]);

  const navBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "44px",
    borderRadius: "var(--radius)",
    background: "var(--ink-raised)",
    border: "1px solid var(--ink-line)",
    color: "var(--bone)",
    cursor: "pointer",
    flexShrink: 0,
    transition: reducedMotion ? "none" : "background 150ms ease",
  };

  return (
    <section
      id="gallery"
      aria-label="Installation gallery"
      style={{
        background: "var(--ink)",
        borderTop: "1px solid var(--ink-line)",
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="eyebrow mb-6">GALLERY</p>
          <h2
            className="font-medium"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              color: "var(--bone)",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              maxWidth: "560px",
            }}
          >
            Where the system lives.
          </h2>
          <p
            style={{
              marginTop: "16px",
              color: "var(--bone-dim)",
              fontSize: "1rem",
              lineHeight: 1.7,
              maxWidth: "520px",
            }}
          >
            Pool coping, water features, garden edges, paved terraces. Sealed
            end to end, warm white throughout.
          </p>
        </div>

        <div
          className="overflow-hidden"
          ref={emblaRef}
          aria-roledescription="carousel"
          aria-label="Installation photos"
          style={{ borderRadius: "var(--radius)" }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              willChange: reducedMotion ? "auto" : "transform",
            }}
          >
            {slides.map((slide, i) => (
              <div
                key={slide.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}`}
                style={{
                  flex: "0 0 clamp(260px, 70vw, 640px)",
                  aspectRatio: "3 / 4",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--ink-line)",
                  background: "var(--ink-raised)",
                }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 640px) 70vw, 640px"
                  style={{ objectFit: "cover" }}
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex items-center justify-between mt-6"
          style={{ gap: "16px" }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous photo"
              style={navBtn}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next photo"
              style={navBtn}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Gallery slides"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === selectedIndex}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                style={{
                  width: i === selectedIndex ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background:
                    i === selectedIndex
                      ? "var(--bone)"
                      : "var(--ink-line)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: reducedMotion
                    ? "none"
                    : "width 200ms ease, background 200ms ease",
                }}
              />
            ))}
          </div>

          <p
            className="spec-mono"
            style={{
              fontSize: "0.72rem",
              color: "var(--bone-dim)",
              letterSpacing: "0.06em",
            }}
            aria-live="polite"
            aria-atomic="true"
          >
            {selectedIndex + 1} / {slides.length}
          </p>
        </div>
      </div>
    </section>
  );
}
