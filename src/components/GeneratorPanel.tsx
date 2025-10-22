import { Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GeneratorPanel = () => {
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/50 flex items-center justify-center">
              <Settings className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Dropdown Generator Panel</h2>
              <p className="text-sm text-muted-foreground">Live equipment specification view</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 bg-card border border-border/50 rounded-2xl p-8">
            <div className="space-y-2">
              <Label htmlFor="equipment-type">Equipment Type</Label>
              <Select defaultValue="motor">
                <SelectTrigger id="equipment-type" className="border-primary/30 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motor">Motor</SelectItem>
                  <SelectItem value="pump">Pump</SelectItem>
                  <SelectItem value="boiler">Boiler</SelectItem>
                  <SelectItem value="chiller">Chiller</SelectItem>
                  <SelectItem value="compressor">Compressor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select defaultValue="baldor">
                <SelectTrigger id="brand" className="border-primary/30 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baldor">Baldor</SelectItem>
                  <SelectItem value="carrier">Carrier</SelectItem>
                  <SelectItem value="york">York</SelectItem>
                  <SelectItem value="armstrong">Armstrong</SelectItem>
                  <SelectItem value="reliance">Reliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rpm">RPM</Label>
              <Input 
                id="rpm" 
                type="number" 
                placeholder="1750" 
                className="border-primary/30 focus:border-primary bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="voltage">Voltage</Label>
              <Input 
                id="voltage" 
                type="number" 
                placeholder="460" 
                className="border-primary/30 focus:border-primary bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hp">Horsepower (HP)</Label>
              <Input 
                id="hp" 
                type="number" 
                placeholder="10" 
                className="border-primary/30 focus:border-primary bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpm">GPM Estimator</Label>
              <Input 
                id="gpm" 
                type="number" 
                placeholder="Auto-calculated" 
                className="border-secondary/30 focus:border-secondary bg-background"
                disabled
              />
              <p className="text-xs text-muted-foreground">Formula: GPM = RPM × Displacement / 231</p>
            </div>

            <div className="md:col-span-2 pt-4">
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-secondary/50 shadow-lg hover:shadow-secondary/50 transition-all">
                <Zap className="w-4 h-4 mr-2" />
                Generate Action Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneratorPanel;
