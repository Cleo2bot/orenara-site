import type { Metadata } from "next";
import TradeNavbar from "@/components/trade/TradeNavbar";
import TradeHero from "@/components/trade/TradeHero";
import TradeSteps from "@/components/trade/TradeSteps";
import WhyTrades from "@/components/trade/WhyTrades";
import TradeEnquiryForm from "@/components/trade/TradeEnquiryForm";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Orenara Trade — Priced fast, delivered when we say",
  description:
    "Trade orders for IP68 outdoor LED strip lighting. Firm price and confirmed delivery date within 24 hours. 20 business day standard lead time, expedite available for hard deadlines. Supply-only, RCM compliant.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TradePage() {
  return (
    <>
      <TradeNavbar />
      <main>
        <TradeHero />
        <TradeSteps />
        <WhyTrades />
        <TradeEnquiryForm />
      </main>
      <Footer />
    </>
  );
}
