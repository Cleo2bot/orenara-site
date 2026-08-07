interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Height in px for each named size, matching the old font-size values
const sizeMap: Record<string, string> = {
  sm: "15.5px",
  md: "20px",
  lg: "28px",
};

/**
 * ORENARA custom SVG wordmark.
 *
 * The E uses a bespoke letterform:
 *   – no top horizontal bar; instead a floating dash sits above the cap line
 *   – the bottom has a U-bracket shape (horizontal foot + short right upstroke)
 *     rather than a plain bottom bar
 *
 * stroke="currentColor" means the parent's text colour controls the glyph colour,
 * so every existing text-* / color: var(--bone) rule continues to work.
 *
 * ViewBox: x –4 → 424, y 4 → 98  (width 428, height 94)
 * Cap height occupies y 30 → 94 (64 units).
 * Floating dash centred at y 13 (above cap line, clearly floating).
 * Stroke width 7.5 → ~1.25 px at size "sm" on a 2× retina display.
 */
export default function Wordmark({ size = "md", className = "" }: WordmarkProps) {
  return (
    <svg
      viewBox="-4 4 428 94"
      fill="none"
      stroke="currentColor"
      strokeWidth="7.5"
      strokeLinecap="butt"
      strokeLinejoin="miter"
      style={{ height: sizeMap[size], width: "auto", display: "block" }}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* ── O ─────────────────────────────────────────────── */}
      <ellipse cx="26" cy="62" rx="22" ry="28" />

      {/* ── R ─────────────────────────────────────────────── */}
      {/* spine · bowl top · bowl right · bowl return · diagonal leg */}
      <path d="M72,30 V94 M72,30 H106 M106,30 V58 M72,58 H106 M83,58 L114,94" />

      {/* ── E  (custom letterform) ────────────────────────── */}
      {/* spine · middle arm · bottom foot · foot right upstroke */}
      <path d="M134,30 V94 M134,58 H167 M134,94 H171 M171,94 V75" />
      {/* floating dash — detached, above cap line */}
      <line x1="139" y1="13" x2="166" y2="13" />

      {/* ── N ─────────────────────────────────────────────── */}
      {/* left spine · diagonal · right spine */}
      <path d="M192,30 V94 M192,30 L229,94 M229,30 V94" />

      {/* ── A (1st) ───────────────────────────────────────── */}
      {/* left leg · right leg · crossbar */}
      <path d="M249,94 L272,30 L295,94 M259,67 H285" />

      {/* ── R (2nd) ───────────────────────────────────────── */}
      <path d="M315,30 V94 M315,30 H349 M349,30 V58 M315,58 H349 M326,58 L357,94" />

      {/* ── A (2nd) ───────────────────────────────────────── */}
      <path d="M375,94 L398,30 L421,94 M385,67 H411" />
    </svg>
  );
}
