import { Zap, Database, FileCheck } from "lucide-react";
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
  const { 
    currentFacility,
    equipmentData, 
    setEquipmentData, 
    setPerformanceData, 
    registeredEquipment,
    setRegisteredEquipment,
    isProcessing, 
    setIsProcessing 
  } = useEquipment();

  const [formData, setFormData] = useState({
    Equipment_Type: "",
    Brand: "",
    RPM: "",
    Voltage: "",
    HP: "",
    Displacement: "0.5",
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
    const rpm = parseFloat(formData.RPM) || 0;
    const displacement = parseFloat(formData.Displacement) || 0;
    const gpm = (rpm * displacement) / 231;
    setCalculatedGPM(gpm);
  }, [formData.RPM, formData.Displacement]);

  const handleRegisterEquipment = async () => {
    if (!currentFacility) {
      toast({
        title: "No Facility Selected",
        description: "Please select a facility before registering equipment.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.Equipment_Type || !formData.Brand) {
      toast({
        title: "Missing Information",
        description: "Please fill in equipment type and brand.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // First calculate performance
      const { data: perfData, error: perfError } = await supabase.functions.invoke('calculate-performance', {
        body: {
          Equipment_Type: formData.Equipment_Type,
          Brand: formData.Brand,
          RPM: parseFloat(formData.RPM) || 0,
          HP: parseFloat(formData.HP) || 0,
          Voltage: parseFloat(formData.Voltage) || 0,
          Displacement: parseFloat(formData.Displacement) || 0,
        },
      });

      if (perfError) throw perfError;

      const performanceData = perfData.success ? perfData.data : {};
      setPerformanceData(performanceData);

      // Register equipment with auto-assignments
      const { data: regData, error: regError } = await supabase.functions.invoke('register-equipment', {
        body: {
          facility_id: currentFacility.id,
          equipment_type: formData.Equipment_Type,
          brand: formData.Brand,
          rpm: parseFloat(formData.RPM) || null,
          hp: parseFloat(formData.HP) || null,
          voltage: parseFloat(formData.Voltage) || null,
          displacement: parseFloat(formData.Displacement) || null,
          gpm: calculatedGPM,
          efficiency_score: performanceData.Efficiency_Score,
          condition: performanceData.Condition,
          sensor_enabled: false,
        },
      });

      if (regError) throw regError;

      if (regData.success) {
        setRegisteredEquipment(regData.data);

        const fullData = {
          Equipment_Type: formData.Equipment_Type,
          Brand: formData.Brand,
          RPM: parseFloat(formData.RPM),
          HP: parseFloat(formData.HP),
          Voltage: parseFloat(formData.Voltage),
          Displacement: parseFloat(formData.Displacement),
          GPM: calculatedGPM,
          ...performanceData,
          Timestamp: new Date().toISOString(),
          Uploaded_By: "Equipment Intelligence Tool User",
        };
        setEquipmentData(fullData as any);

        // Send to webhooks based on logger module
        const { data: webhookData, error: webhookError } = await supabase.functions.invoke('send-to-webhooks', {
          body: {
            equipmentData: {
              ...fullData,
              logger_module: regData.data.logger_module,
              compliance_ruleset: regData.data.compliance_ruleset,
            },
            enabledWorkflows: {
              facilities: true,
              compliance: true,
            },
          },
        });

        if (webhookError) {
          console.error('Webhook error:', webhookError);
        }

        toast({
          title: "✅ Equipment Registered",
          description: `Assigned to ${regData.data.logger_module} logger with ${regData.data.compliance_ruleset} compliance.`,
        });

        setTimeout(() => {
          document.getElementById('performance-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      } else {
        throw new Error(regData.error || 'Failed to register equipment');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "❌ Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register equipment",
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
              Equipment Registration
            </h2>
            <p className="text-muted-foreground">
              Review specs and register to facility with auto-assigned modules
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 backdrop-blur-sm">
            {/* Auto-Assignment Preview */}
            {formData.Equipment_Type && (
              <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Auto-Assignment Preview</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Logger:</span>
                    <span className="ml-2 font-medium">
                      {formData.Equipment_Type === 'Boiler' ? 'boiler' : 
                       formData.Equipment_Type === 'Chiller' ? 'chiller' :
                       formData.Equipment_Type === 'Pump' ? 'pump' :
                       formData.Equipment_Type === 'Compressor' ? 'compressor' : 'energy'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Compliance:</span>
                    <span className="ml-2 font-medium text-xs">
                      {formData.Equipment_Type === 'Boiler' ? 'ASME' : 
                       formData.Equipment_Type === 'Chiller' ? 'EPA' :
                       formData.Equipment_Type === 'Pump' ? 'DOE' :
                       formData.Equipment_Type === 'Compressor' ? 'OSHA' : 'GENERAL'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Service:</span>
                    <span className="ml-2 font-medium">
                      {formData.Equipment_Type === 'Boiler' ? '30 days' : 
                       formData.Equipment_Type === 'Chiller' ? '45 days' : '90 days'}
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                    <SelectItem value="AHU">AHU</SelectItem>
                    <SelectItem value="RTU">RTU</SelectItem>
                    <SelectItem value="Exhaust Fan">Exhaust Fan</SelectItem>
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
                    <SelectItem value="Lennox">Lennox</SelectItem>
                    <SelectItem value="Daikin">Daikin</SelectItem>
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
                <Label htmlFor="gpm">GPM (Calculated)</Label>
                <Input
                  id="gpm"
                  value={`${calculatedGPM.toFixed(2)} GPM`}
                  disabled
                  className="bg-muted/50"
                />
              </div>
            </div>

            {/* Registered Equipment Info */}
            {registeredEquipment && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileCheck className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">Equipment Registered</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Logger Module: <span className="font-medium text-foreground">{registeredEquipment.logger_module}</span></p>
                  <p>Compliance: <span className="font-medium text-foreground">{registeredEquipment.compliance_ruleset}</span></p>
                  <p>Service Interval: <span className="font-medium text-foreground">{registeredEquipment.benchmark_defaults?.service_interval_days} days</span></p>
                </div>
              </div>
            )}

            <Button
              className="w-full mt-8 bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50 shadow-lg hover:shadow-primary/50 transition-all"
              onClick={handleRegisterEquipment}
              disabled={isProcessing || !currentFacility}
            >
              <Zap className="w-4 h-4 mr-2" />
              {isProcessing ? 'Registering...' : 'Register Equipment to Facility'}
            </Button>

            {!currentFacility && (
              <p className="text-center text-sm text-destructive mt-2">
                Please select a facility first
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneratorPanel;
