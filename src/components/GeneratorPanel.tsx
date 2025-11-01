import { Zap, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEquipment } from "@/contexts/EquipmentContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const GeneratorPanel = () => {
  const { equipmentData, setEquipmentData, setPerformanceData, isProcessing, setIsProcessing } = useEquipment();
  const [formData, setFormData] = useState({
    Equipment_Type: "",
    Brand: "",
    RPM: "",
    Voltage: "",
    HP: "",
    Displacement: "0.5", // Default displacement
  });

  const [calculatedGPM, setCalculatedGPM] = useState<number>(0);

  useEffect(() => {
    if (equipmentData) {
      setFormData({
        Equipment_Type: equipmentData.Equipment_Type || "",
        Brand: equipmentData.Brand || "",
        RPM: equipmentData.RPM?.toString() || "",
        Voltage: equipmentData.Voltage?.toString() || "",
        HP: equipmentData.HP?.toString() || "",
        Displacement: equipmentData.Displacement?.toString() || "0.5",
      });
    }
  }, [equipmentData]);

  useEffect(() => {
    // Calculate GPM: (RPM × Displacement) / 231
    const rpm = parseFloat(formData.RPM) || 0;
    const displacement = parseFloat(formData.Displacement) || 0;
    const gpm = (rpm * displacement) / 231;
    setCalculatedGPM(gpm);
  }, [formData.RPM, formData.Displacement]);

  const handleGenerateActionPlan = async () => {
    if (!formData.Equipment_Type || !formData.Brand || !formData.RPM || !formData.HP || !formData.Voltage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all equipment details before generating analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate performance
      const { data: perfData, error: perfError } = await supabase.functions.invoke('calculate-performance', {
        body: {
          Equipment_Type: formData.Equipment_Type,
          Brand: formData.Brand,
          RPM: parseFloat(formData.RPM),
          HP: parseFloat(formData.HP),
          Voltage: parseFloat(formData.Voltage),
          Displacement: parseFloat(formData.Displacement),
        },
      });

      if (perfError) throw perfError;

      if (perfData.success) {
        const fullData = {
          Equipment_Type: formData.Equipment_Type,
          Brand: formData.Brand,
          RPM: parseFloat(formData.RPM),
          HP: parseFloat(formData.HP),
          Voltage: parseFloat(formData.Voltage),
          ...perfData.data,
          Timestamp: new Date().toISOString(),
          Uploaded_By: "Equipment Intelligence Tool User",
        };

        setPerformanceData(perfData.data);
        setEquipmentData(fullData as any);

        // Send to webhooks
        const { data: webhookData, error: webhookError } = await supabase.functions.invoke('send-to-webhooks', {
          body: {
            equipmentData: fullData,
            enabledWorkflows: {
              facilities: true,
              compliance: true,
            },
          },
        });

        if (webhookError) {
          console.error('Webhook error:', webhookError);
        }

        const webhookResults = webhookData?.results || {};
        const webhookErrors = webhookData?.errors || {};

        toast({
          title: "✅ Analysis Complete",
          description: `Performance calculated. ${Object.keys(webhookResults).length} integrations synced.`,
        });

        // Scroll to performance section
        setTimeout(() => {
          document.getElementById('performance-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);

      } else {
        throw new Error(perfData.error || 'Failed to calculate performance');
      }
    } catch (error) {
      console.error('Generate action plan error:', error);
      toast({
        title: "❌ Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate analysis",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="generator-panel" className="py-20 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Dropdown Generator Panel
            </h2>
            <p className="text-muted-foreground">
              Review extracted specs and generate comprehensive analysis
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="equipment-type">Equipment Type</Label>
                <Select 
                  value={formData.Equipment_Type} 
                  onValueChange={(value) => setFormData({ ...formData, Equipment_Type: value })}
                >
                  <SelectTrigger id="equipment-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Motor">Motor</SelectItem>
                    <SelectItem value="Pump">Pump</SelectItem>
                    <SelectItem value="Boiler">Boiler</SelectItem>
                    <SelectItem value="Chiller">Chiller</SelectItem>
                    <SelectItem value="Compressor">Compressor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="brand">Brand</Label>
                <Select 
                  value={formData.Brand} 
                  onValueChange={(value) => setFormData({ ...formData, Brand: value })}
                >
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Carrier">Carrier</SelectItem>
                    <SelectItem value="York">York</SelectItem>
                    <SelectItem value="Baldor">Baldor</SelectItem>
                    <SelectItem value="Armstrong">Armstrong</SelectItem>
                    <SelectItem value="Reliance">Reliance</SelectItem>
                    <SelectItem value="Cleaver-Brooks">Cleaver-Brooks</SelectItem>
                    <SelectItem value="Trane">Trane</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rpm">RPM</Label>
                <Input
                  id="rpm"
                  type="number"
                  placeholder="1750"
                  value={formData.RPM}
                  onChange={(e) => setFormData({ ...formData, RPM: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="voltage">Voltage</Label>
                <Input
                  id="voltage"
                  type="number"
                  placeholder="480"
                  value={formData.Voltage}
                  onChange={(e) => setFormData({ ...formData, Voltage: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="hp">Horsepower (HP)</Label>
                <Input
                  id="hp"
                  type="number"
                  placeholder="20"
                  value={formData.HP}
                  onChange={(e) => setFormData({ ...formData, HP: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="displacement">Displacement (gal/rev)</Label>
                <Input
                  id="displacement"
                  type="number"
                  step="0.01"
                  placeholder="0.5"
                  value={formData.Displacement}
                  onChange={(e) => setFormData({ ...formData, Displacement: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="gpm">GPM Estimator (Calculated)</Label>
                <Input
                  id="gpm"
                  value={`${calculatedGPM.toFixed(2)} GPM (Formula: RPM × Displacement / 231)`}
                  disabled
                  className="bg-muted/50"
                />
              </div>
            </div>

            <Button
              className="w-full mt-8 bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50 shadow-lg hover:shadow-primary/50 transition-all"
              onClick={handleGenerateActionPlan}
              disabled={isProcessing}
            >
              <Zap className="w-4 h-4 mr-2" />
              {isProcessing ? 'Generating Analysis...' : 'Generate Action Plan'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneratorPanel;
