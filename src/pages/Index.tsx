import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
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
