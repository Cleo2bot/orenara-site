import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import QuoteBuilder from "@/components/quote-builder/QuoteBuilder";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Build Your Kit — Orenara Quote Builder",
  description:
    "Piece your outdoor LED lighting job together zone by zone and get a straight, no-obligation quote. Works out drivers, dimmers, and mounting track for straight and curved runs. IP68, RCM compliant.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function QuoteBuilderPage() {
  return (
    <>
      <Navbar />
      <main>
        <QuoteBuilder />
      </main>
      <Footer />
    </>
  );
}
