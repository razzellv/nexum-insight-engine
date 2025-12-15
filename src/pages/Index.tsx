import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { FacilitySelector } from "@/components/FacilitySelector";
import UploadSection from "@/components/UploadSection";
import AIAnalysisSection from "@/components/AIAnalysisSection";
import GeneratorPanel from "@/components/GeneratorPanel";
import PerformanceSection from "@/components/PerformanceSection";
import IntegrationSection from "@/components/IntegrationSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      {/* Facility Registry Section */}
      <section className="py-10 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <FacilitySelector />
          </div>
        </div>
      </section>
      
      <UploadSection />
      <div id="ai-analysis-section">
        <AIAnalysisSection />
      </div>
      <GeneratorPanel />
      <PerformanceSection />
      <IntegrationSection />
      <Footer />
    </div>
  );
};

export default Index;
