import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import ProblemSection from "@/components/sections/ProblemSection";
import Environments from "@/components/sections/Environments";
import MountingSystem from "@/components/sections/MountingSystem";
import ProductKits from "@/components/sections/ProductKits";
import DifferenceSection from "@/components/sections/DifferenceSection";
import KitComponents from "@/components/sections/KitComponents";
import KitBox from "@/components/sections/KitBox";
import EmberBreather from "@/components/sections/EmberBreather";
import HowItWorks from "@/components/sections/HowItWorks";
import SpecSection from "@/components/sections/SpecSection";
import InstallerReview from "@/components/sections/InstallerReview";
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
        <KitComponents />
        <MountingSystem />
        <EmberBreather />
        <ProductKits />
        <HowItWorks />
        <InstallerReview />
        <OutcomeSection />
        <SpecSection />
        <EnquiryForm />
      </main>
      <Footer />
    </>
  );
}
