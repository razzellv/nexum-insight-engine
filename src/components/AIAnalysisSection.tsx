import { Brain, Download, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEquipment } from "@/contexts/EquipmentContext";
import { toast } from "@/hooks/use-toast";

const AIAnalysisSection = () => {
  const { aiAnalysis } = useEquipment();

  if (!aiAnalysis) return null;

  const handleAddToWorkOrder = () => {
    toast({
      title: "Added to Work Order List",
      description: "This analysis has been added to your work order queue.",
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Report Generated",
      description: "Your report is being prepared for download.",
    });
  };

  const handleSendToSupervisor = () => {
    toast({
      title: "Sent to Supervisor",
      description: "Analysis forwarded to Supervisor Review Board.",
    });
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Equipment Intelligence Report
            </h2>
            <p className="text-muted-foreground">
              Comprehensive AI analysis with diagnostics and recommendations
            </p>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-8">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {aiAnalysis}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border/50">
              <p className="text-sm font-semibold mb-4 text-foreground">OPTIONS</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handleAddToWorkOrder}
                  className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50"
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Add to Work Order List
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  className="w-full bg-accent/20 hover:bg-accent/30 text-accent-foreground border border-accent/50"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button
                  onClick={handleSendToSupervisor}
                  className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground border border-secondary/50"
                  variant="outline"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send to Supervisor Review
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIAnalysisSection;
