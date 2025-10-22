import { Activity, AlertCircle, CheckCircle, Download, Send, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const PerformanceSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Performance Intelligence Summary</h2>
              <p className="text-sm text-muted-foreground">AI-powered equipment analysis</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Efficiency Score</p>
                    <span className="text-2xl font-bold text-primary">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-sm font-medium">Condition Rating</p>
                  </div>
                  <p className="text-xl font-bold">Good</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-secondary" />
                    <p className="text-sm font-medium">Next Service</p>
                  </div>
                  <p className="text-xl font-bold">30 Days</p>
                </div>
              </div>

              <div className="border-t border-border/50 pt-6">
                <h3 className="text-lg font-semibold mb-4">Suggested Actions</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-medium">Preventive Maintenance Recommended</p>
                      <p className="text-sm text-muted-foreground">Schedule lubrication and inspection within 30 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                    <div>
                      <p className="font-medium">Calibration Check</p>
                      <p className="text-sm text-muted-foreground">Verify voltage readings and adjust if needed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t border-border/50 mt-6">
                <Button variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                  <Send className="w-4 h-4 mr-2" />
                  Send to Portal
                </Button>
                <Button variant="outline" className="border-secondary/30 hover:border-secondary hover:bg-secondary/10">
                  <Flag className="w-4 h-4 mr-2" />
                  Flag for Technician
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
