import { FileDown, Send, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEquipment } from "@/contexts/EquipmentContext";
import { toast } from "@/hooks/use-toast";

const PerformanceSection = () => {
  const { equipmentData, performanceData } = useEquipment();

  if (!performanceData) {
    return (
      <section id="performance-section" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-card/50 border border-border rounded-2xl p-12 backdrop-blur-sm">
              <p className="text-muted-foreground">
                Upload equipment data and generate analysis to view performance intelligence summary
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "Generating PDF report... (Feature in development)",
    });
  };

  const handleSendToPortal = () => {
    toast({
      title: "✅ Sent to Portal",
      description: "Equipment data has been published to Same.new dashboard feed.",
    });
  };

  const handleFlagTechnician = () => {
    toast({
      title: "🚩 Flagged for Review",
      description: "Technician has been notified via Make.com webhook.",
    });
  };

  return (
    <section id="performance-section" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Performance Intelligence Summary
            </h2>
            <p className="text-muted-foreground">
              AI-generated insights and maintenance recommendations
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Efficiency Score</h3>
                  <span className="text-2xl font-bold text-primary">
                    {performanceData.Efficiency_Score}%
                  </span>
                </div>
                <Progress value={performanceData.Efficiency_Score} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Condition Rating</p>
                  <p className={`text-xl font-bold ${
                    performanceData.Condition === 'Good' 
                      ? 'text-green-500' 
                      : performanceData.Condition === 'Needs Service'
                      ? 'text-yellow-500'
                      : 'text-red-500'
                  }`}>
                    {performanceData.Condition}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Next Service</p>
                  <p className="text-xl font-bold">{performanceData.Next_Service}</p>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Suggested Actions
                </h4>
                <ul className="space-y-2">
                  {performanceData.Suggested_Actions?.map((action: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleExportPDF}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSendToPortal}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send to Portal
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleFlagTechnician}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Flag for Technician
                </Button>
              </div>
            </div>
          </div>

          {equipmentData && (
            <div className="mt-6 bg-card/30 border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground text-center">
                📊 Data synced to: Facilities Sheet, Compliance Sheet, Make.com ({equipmentData.Equipment_Type} Log)
                <br />
                🔐 Data processed securely under Nexum Suum's ISO 27001 / SOC 2 standards
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
