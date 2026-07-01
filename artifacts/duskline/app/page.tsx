import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import ProblemSection from "@/components/sections/ProblemSection";
import ProductKits from "@/components/sections/ProductKits";
import HowItWorks from "@/components/sections/HowItWorks";
import SpecSection from "@/components/sections/SpecSection";
import EnquiryForm from "@/components/sections/EnquiryForm";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <ProductKits />
        <HowItWorks />
        <SpecSection />
        <EnquiryForm />
      </main>
      <Footer />
    </>
  );
}
