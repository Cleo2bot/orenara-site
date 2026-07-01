import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import ProblemSection from "@/components/sections/ProblemSection";
import MountingSystem from "@/components/sections/MountingSystem";
import ProductKits from "@/components/sections/ProductKits";
import HowItWorks from "@/components/sections/HowItWorks";
import SpecSection from "@/components/sections/SpecSection";
import InstallerReview from "@/components/sections/InstallerReview";
import EnquiryForm from "@/components/sections/EnquiryForm";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <MountingSystem />
        <ProductKits />
        <HowItWorks />
        <SpecSection />
        <InstallerReview />
        <EnquiryForm />
      </main>
      <Footer />
    </>
  );
}
