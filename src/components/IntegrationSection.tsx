import { Link2, CheckCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const IntegrationSection = () => {
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center">
              <Link2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Workflow Integration</h2>
              <p className="text-sm text-muted-foreground">Connected workflows and automations</p>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-background/50 rounded-xl border border-border/30 hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor="systeme" className="text-base font-semibold cursor-pointer">
                      Systeme.io Integration
                    </Label>
                    <p className="text-sm text-muted-foreground">Send reports to CRM or client portal</p>
                  </div>
                </div>
                <Switch id="systeme" defaultChecked />
              </div>

              <div className="flex items-center justify-between p-6 bg-background/50 rounded-xl border border-border/30 hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor="same" className="text-base font-semibold cursor-pointer">
                      Same.new Integration
                    </Label>
                    <p className="text-sm text-muted-foreground">Auto-publish to client dashboard or feed</p>
                  </div>
                </div>
                <Switch id="same" defaultChecked />
              </div>

              <div className="flex items-center justify-between p-6 bg-background/50 rounded-xl border border-border/30 hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor="nexum" className="text-base font-semibold cursor-pointer">
                      NexumSuum.com
                    </Label>
                    <p className="text-sm text-muted-foreground">Display equipment library and performance scores</p>
                  </div>
                </div>
                <Switch id="nexum" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;
