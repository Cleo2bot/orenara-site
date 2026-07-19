import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import ProblemSection from "@/components/sections/ProblemSection";
import Environments from "@/components/sections/Environments";
import MountingSystem from "@/components/sections/MountingSystem";
import ProductKits from "@/components/sections/ProductKits";
import DifferenceSection from "@/components/sections/DifferenceSection";
import KitComponents from "@/components/sections/KitComponents";
import KitBox from "@/components/sections/KitBox";
import StripGlow from "@/components/sections/StripGlow";
import EmberBreather from "@/components/sections/EmberBreather";
import HowItWorks from "@/components/sections/HowItWorks";
import Gallery from "@/components/sections/Gallery";
import ProofBand from "@/components/sections/ProofBand";
import SpecSection from "@/components/sections/SpecSection";
import EnquiryForm from "@/components/sections/EnquiryForm";
import OutcomeSection from "@/components/sections/OutcomeSection";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <DifferenceSection />
        <Environments />
        <Gallery />
        <KitComponents />
        <StripGlow />
        <KitBox />
        <MountingSystem />
        <EmberBreather />
        <ProductKits />
        <HowItWorks />
        <OutcomeSection />
        <SpecSection />
        <ProofBand />
        <EnquiryForm />
      </main>
      <Footer />
    </>
  );
}
