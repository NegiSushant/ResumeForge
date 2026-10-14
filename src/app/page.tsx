import HeroSection from "@/components/landing/HeroSection";
import ArchitectureFlow from "@/components/landing/ArchitectureFlow";
import SampleReportPreview from "@/components/landing/SampleReportPreview";
import PrivacyComparison from "@/components/landing/PrivacyComparison";
import TechStackSpecs from "@/components/landing/TechStackSpecs";
import CtaSection from "@/components/landing/CtaSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <HeroSection />
        <ArchitectureFlow />
        <SampleReportPreview />
        <PrivacyComparison />
        <TechStackSpecs />
        <CtaSection />
      </main>
    </div>
  );
}
