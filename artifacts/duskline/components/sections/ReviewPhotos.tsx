"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

const reviewPhotos = [
  {
    src: "/assets/review-kit-box.jpg",
    label: "The full kit as delivered",
    alt: "Orenara outdoor LED kit as delivered — coiled white IP68 neon-flex strip, LTECH LED driver, 0–10V wall dimmer and 240V plug lead packed in the box",
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

export default function ReviewPhotos() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const show = useCallback((i: number, opener: HTMLElement) => {
    openerRef.current = opener;
    setIndex(i);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + reviewPhotos.length) % reviewPhotos.length),
    [],
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % reviewPhotos.length),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "Tab") {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = openerRef.current;
    closeBtnRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [open, close, prev, next]);

  const active = reviewPhotos[index];

  const navBtn: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "var(--radius)",
    background: "var(--ink-raised)",
    border: "1px solid var(--ink-line)",
    color: "var(--bone)",
    cursor: "pointer",
  };

  return (
    <div
      className="mt-8"
      style={{ paddingTop: "22px", borderTop: "1px solid var(--ink-line)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Camera size={14} style={{ color: "var(--bone-dim)" }} aria-hidden="true" />
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 500,
            color: "var(--bone-dim)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Photos from a verified trade delivery
        </span>
      </div>

      <div
        className="flex gap-2.5 overflow-x-auto pb-1 review-photo-strip"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {reviewPhotos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={(e) => show(i, e.currentTarget)}
            aria-label={`Open photo: ${photo.label}`}
            data-testid={`review-photo-${i}`}
            className="group img-treated"
            style={{
              flex: "0 0 auto",
              width: "84px",
              height: "84px",
              borderRadius: "var(--radius)",
              overflow: "hidden",
              border: "1px solid var(--ink-line)",
              background: "var(--ink)",
              cursor: "pointer",
              scrollSnapAlign: "start",
              padding: 0,
            }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="84px"
              style={{ objectFit: "cover" }}
            />
            <span
              aria-hidden="true"
              className="opacity-0 group-hover:opacity-100"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "color-mix(in srgb, var(--ink) 45%, transparent)",
                color: "var(--bone)",
                transition: "opacity 150ms ease",
              }}
            >
              <Maximize2 size={16} />
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={active.label}
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "color-mix(in srgb, var(--ink) 96%, transparent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius)",
              background: "var(--ink-raised)",
              border: "1px solid var(--ink-line)",
              color: "var(--bone)",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
            style={{ ...navBtn, left: "18px" }}
          >
            <ChevronLeft size={24} />
          </button>

          <figure
            onClick={(e) => e.stopPropagation()}
            style={{ margin: 0, maxWidth: "880px", width: "100%" }}
          >
            <div
              className="img-treated"
              style={{
                width: "100%",
                aspectRatio: "4 / 3",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                border: "1px solid var(--ink-line)",
                background: "var(--ink)",
              }}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="(max-width: 880px) 100vw, 880px"
                style={{ objectFit: "contain" }}
              />
            </div>
            <figcaption
              style={{
                marginTop: "12px",
                textAlign: "center",
                fontSize: "0.8rem",
                color: "var(--bone-dim)",
              }}
            >
              {active.label}
              <span style={{ color: "var(--bone-dim)" }}>
                {" "}
                · {index + 1} / {reviewPhotos.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            style={{ ...navBtn, right: "18px" }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
