"use client";

import Image from "next/image";

export default function Hero() {
  const scrollToForm = () => {
    document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      {/* Hero background photo — unified treatment, overlay strengthened at the bottom third */}
      <div
        className="img-treated"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        <Image
          src="/assets/generated/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div aria-hidden="true" className="scrim scrim-strong" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
        {/* Overline badge */}
        <div className="animate-fade-up flex justify-center mb-8">
          <span className="spec-badge spec-mono-upper">
            IP68 Outdoor Lighting · Australian Conditions
          </span>
        </div>

        {/* H1 — the promise, not the brand name (nav already says it) */}
        <div className="animate-fade-up-delay-1">
          <h1
            style={{
              fontSize: "clamp(2rem, 5.5vw, 3.75rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: "var(--bone)",
              maxWidth: "820px",
              margin: "0 auto",
            }}
          >
            Built for salt air, pool chemicals, and Queensland summers.
          </h1>
        </div>

        {/* Support line */}
        <p
          className="animate-fade-up-delay-2"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.1875rem)",
            color: "var(--bone-dim)",
            maxWidth: "600px",
            margin: "24px auto 40px",
            lineHeight: 1.7,
          }}
        >
          Fully submersible. Properly dimmable. Made for conditions that break
          everything else.
        </p>

        {/* CTA group */}
        <div className="animate-fade-up-delay-3 flex flex-col items-center gap-4">
          <button
            onClick={scrollToForm}
            className="btn-primary"
            style={{ fontSize: "1.0625rem", padding: "16px 36px" }}
            data-testid="hero-enquire-btn"
          >
            Enquire for Pricing
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2"
        style={{ transform: "translateX(-50%)" }}
        aria-hidden="true"
      >
        <div
          style={{
            width: "1px",
            height: "48px",
            background: "var(--ink-line)",
            margin: "0 auto",
          }}
        />
      </div>
    </section>
  );
}
