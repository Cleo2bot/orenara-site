import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orenara Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ink)",
        color: "var(--bone)",
        fontFamily: "var(--font-body)",
      }}
    >
      {children}
    </div>
  );
}
