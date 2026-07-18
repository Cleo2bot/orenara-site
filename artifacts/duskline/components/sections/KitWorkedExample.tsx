const steps = [
  {
    title: "Two sealed runs — 11m and 7m.",
    body: "Each run is factory-sealed and cut to your measured length. Corners terminate and restart. No field joins, ever.",
  },
  {
    title: "Two drivers.",
    body: "No driver serves more than 12 metres of strip, and a run is never split across drivers. 11m takes one driver; adding the 7m run would exceed 12m, so it gets its own.",
  },
  {
    title: "Two connector and end-cap sets.",
    body: "One sealed set per run — the same IP68 rating as the strip itself.",
  },
  {
    title: "Two mains plugs.",
    body: "One per driver. Pre-wired, AU/NZ, ready for your electrician.",
  },
  {
    title: "18 metres of channel.",
    body: "Rigid for the straight sections, segmented track for the curve — measured to your run lengths.",
  },
];

export default function KitWorkedExample() {
  return (
    <div
      style={{
        marginBottom: "40px",
        background: "var(--ink-raised)",
        border: "1px solid var(--ink-line)",
        borderRadius: "var(--radius)",
        padding: "clamp(24px, 5vw, 48px)",
      }}
    >
      <h2
        className="font-medium"
        style={{
          fontSize: "clamp(1.25rem, 2.5vw, 1.625rem)",
          color: "var(--bone)",
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          marginBottom: "12px",
        }}
      >
        How a system comes together.
      </h2>
      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--bone-dim)",
          lineHeight: 1.7,
          marginBottom: "28px",
          maxWidth: "620px",
        }}
      >
        Every Orenara system is specced from your measurements. Here&apos;s how a typical job builds — an 18-metre garden edge in two runs.
      </p>

      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {steps.map((step, i) => (
          <li
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2rem 1fr",
              gap: "0 14px",
              paddingBottom: i < steps.length - 1 ? "20px" : "0",
              marginBottom: i < steps.length - 1 ? "20px" : "0",
              borderBottom: i < steps.length - 1 ? "1px solid var(--ink-line)" : "none",
            }}
          >
            <span
              className="spec-mono"
              style={{
                fontSize: "0.8125rem",
                color: "var(--bone-dim)",
                paddingTop: "3px",
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--bone)",
                  fontWeight: 500,
                  lineHeight: 1.4,
                  marginBottom: "4px",
                }}
              >
                {step.title}
              </p>
              <p style={{ fontSize: "0.9375rem", color: "var(--bone-dim)", lineHeight: 1.7 }}>
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div
        style={{
          marginTop: "24px",
          paddingTop: "20px",
          borderTop: "1px solid var(--ink-line)",
        }}
      >
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--bone-dim)",
            lineHeight: 1.7,
            fontStyle: "italic",
            maxWidth: "620px",
          }}
        >
          Your job won&apos;t be this job. That&apos;s the point — every system is specced to your measurements and confirmed on your quote before anything is built.
        </p>
      </div>
    </div>
  );
}
