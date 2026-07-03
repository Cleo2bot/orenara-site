import Link from "next/link";
import Wordmark from "@/components/Wordmark";
import Footer from "@/components/sections/Footer";

export default function TradeResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "linear-gradient(180deg, rgba(21,23,28,0.97) 0%, rgba(21,23,28,0.0) 100%)",
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex" }} aria-label="Duskline home">
            <Wordmark size="sm" />
          </Link>
          <Link
            href="/"
            className="hidden sm:inline-flex"
            style={{ color: "#9A9DA8", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none" }}
            data-testid="trade-resources-back-link"
          >
            Back to site
          </Link>
        </nav>
      </header>

      <main style={{ background: "#15171C", minHeight: "100vh" }}>{children}</main>

      <Footer />
    </>
  );
}
