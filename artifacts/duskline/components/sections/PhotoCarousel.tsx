"use client";

import { useCallback, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Photo = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

export default function PhotoCarousel({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const count = photos.length;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  if (count === 0) return null;

  const photo = photos[index];

  const overlayBtn: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(21,23,28,0.72)",
    border: "1px solid rgba(91,100,120,0.4)",
    color: "#F4F1EA",
    cursor: "pointer",
    backdropFilter: "blur(4px)",
  };

  return (
    <div style={{ maxWidth: "520px" }}>
      <div
        role="region"
        aria-label="Installer photos — use left and right arrow keys to change photo"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="rounded-xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F5B25C]"
        style={{
          background: "#1F222B",
          border: "1px solid rgba(91,100,120,0.25)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 10",
            background: "#15171C",
          }}
        >
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="520px"
            style={{ objectFit: "cover" }}
          />

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            data-testid="photo-prev"
            style={{ ...overlayBtn, left: "10px" }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            data-testid="photo-next"
            style={{ ...overlayBtn, right: "10px" }}
          >
            <ChevronRight size={16} />
          </button>

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "10px",
              right: "12px",
              fontSize: "0.72rem",
              fontWeight: 600,
              color: "#F4F1EA",
              background: "rgba(21,23,28,0.72)",
              border: "1px solid rgba(91,100,120,0.4)",
              padding: "2px 8px",
              borderRadius: "999px",
              backdropFilter: "blur(4px)",
            }}
          >
            {index + 1} / {count}
          </div>
        </div>

        <div style={{ padding: "12px 16px 14px" }}>
          <p
            className="font-bold"
            style={{
              fontSize: "0.875rem",
              color: "#F4F1EA",
              letterSpacing: "-0.01em",
            }}
          >
            {photo.title}
          </p>
          <p
            style={{
              marginTop: "4px",
              fontSize: "0.8125rem",
              color: "#9A9DA8",
              lineHeight: 1.55,
            }}
          >
            {photo.caption}
          </p>
        </div>
      </div>

      <div
        className="flex items-center gap-1.5 mt-3"
        role="group"
        aria-label="Choose photo"
      >
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            aria-current={i === index ? "true" : undefined}
            aria-label={`Photo ${i + 1}: ${p.title}`}
            onClick={() => setIndex(i)}
            data-testid={`photo-dot-${i}`}
            style={{
              width: i === index ? "18px" : "7px",
              height: "7px",
              borderRadius: "999px",
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: i === index ? "#F5B25C" : "rgba(91,100,120,0.5)",
              transition: "width 0.2s ease, background 0.2s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
