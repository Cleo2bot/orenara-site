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
      {/* Hero background photo */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/assets/generated/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        {/* Flat scrim to protect text over the photo */}
        <div
          className="absolute inset-0"
          style={{
            background: "color-mix(in srgb, var(--ink) 72%, transparent)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
        {/* Overline badge */}
        <div className="animate-fade-up flex justify-center mb-8">
          <span className="spec-badge spec-mono-upper">
            IP68 Outdoor Lighting · Australian Conditions
          </span>
        </div>

        {/* Wordmark */}
        <div className="animate-fade-up-delay-1 mb-6">
          <h1
            style={{
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
              letterSpacing: "-0.05em",
              lineHeight: "0.9",
              color: "var(--bone)",
            }}
          >
            ORENARA
          </h1>
        </div>

        {/* Tagline */}
        <p
          className="animate-fade-up-delay-2"
          style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            color: "var(--bone-dim)",
            letterSpacing: "0.01em",
            marginTop: "24px",
            marginBottom: "16px",
          }}
        >
          Built for salt air, pool chemicals, and Queensland summers.
        </p>

        {/* Positioning statement */}
        <p
          className="animate-fade-up-delay-2"
          style={{
            fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
            color: "var(--bone-dim)",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          IP68 end-to-end. Properly dimmable. Made for conditions that break
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
          <p className="spec-mono" style={{ letterSpacing: "0.02em" }}>
            Made to order.&nbsp;&nbsp;Ships in 20 business days.
          </p>
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
