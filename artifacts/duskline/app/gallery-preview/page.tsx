import Gallery from "@/components/sections/Gallery";

export const metadata = {
  title: "Gallery Preview — Orenara",
  robots: { index: false, follow: false },
};

export default function GalleryPreviewPage() {
  return (
    <main style={{ background: "var(--ink)", minHeight: "100vh" }}>
      <div
        style={{
          padding: "32px 24px 16px",
          borderBottom: "1px solid var(--ink-line)",
          marginBottom: "0",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--bone-dim)",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Preview only — not linked from any live page
        </p>
      </div>
      <Gallery />
    </main>
  );
}
