import { Upload, Image, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEquipment } from "@/contexts/EquipmentContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState, useRef } from "react";

const UploadSection = () => {
  const { 
    currentFacility,
    setEquipmentData, 
    setAiAnalysis, 
    setRegisteredEquipment,
    isProcessing, 
    setIsProcessing 
  } = useEquipment();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!currentFacility) {
      toast({
        title: "No Facility Selected",
        description: "Please select or create a facility before uploading equipment.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG)",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setUploadComplete(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Call AI analysis function
      const { data: aiData, error: aiError } = await supabase.functions.invoke('analyze-equipment', {
        body: formData,
      });

      if (aiError) throw aiError;

      if (aiData.success) {
        setAiAnalysis(aiData.analysis);
        
        // Also extract basic specs for the generator panel
        const { data: specsData, error: specsError } = await supabase.functions.invoke('extract-specs', {
          body: formData,
        });

        if (specsError) {
          console.error('Specs extraction error:', specsError);
        } else if (specsData.success) {
          setEquipmentData(specsData.data);
        }

        setUploadComplete(true);
        toast({
          title: "✅ AI Analysis Complete",
          description: "Equipment has been analyzed. Proceed to register it.",
        });

        // Scroll to AI analysis section
        setTimeout(() => {
          document.getElementById('ai-analysis-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      } else {
        throw new Error(aiData.error || 'Failed to analyze equipment');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "❌ Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const noFacilitySelected = !currentFacility;

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Equipment Registry
            </h2>
            <p className="text-muted-foreground">
              Upload nameplate images to register equipment to your facility
            </p>
          </div>

          {noFacilitySelected && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">
                Please select or create a facility above before uploading equipment.
              </p>
            </div>
          )}

          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all bg-card/50 backdrop-blur-sm ${
              noFacilitySelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${
              isDragging
                ? 'border-primary bg-primary/10'
                : uploadComplete
                ? 'border-green-500/50 bg-green-500/10'
                : 'border-primary/30 hover:border-primary/60'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              if (!noFacilitySelected) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              if (!noFacilitySelected) handleDrop(e);
            }}
            onClick={() => !noFacilitySelected && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
              disabled={isProcessing || noFacilitySelected}
            />

            <div className="flex flex-col items-center gap-4">
              <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center transition-all ${
                uploadComplete
                  ? 'bg-green-500/20 border-green-500'
                  : 'bg-primary/10 border-primary/30 group-hover:border-glow-blue'
              }`}>
                {uploadComplete ? (
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                ) : (
                  <Image className="w-10 h-10 text-primary" />
                )}
              </div>
              <div>
                <p className="text-lg font-medium mb-1">
                  {uploadComplete
                    ? '✅ Equipment Analyzed'
                    : isDragging
                    ? 'Drop to upload'
                    : 'Drag & drop nameplate images'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {uploadComplete
                    ? 'Proceed to register equipment or upload another'
                    : noFacilitySelected
                    ? 'Select a facility first'
                    : 'or click to browse (JPEG, PNG supported)'}
                </p>
              </div>
              <Button
                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50 shadow-lg hover:shadow-primary/50 transition-all"
                disabled={isProcessing || noFacilitySelected}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isProcessing ? 'Analyzing...' : uploadComplete ? 'Upload Another' : 'Upload & Analyze'}
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Equipment will be auto-assigned to: <span className="font-medium text-foreground">{currentFacility?.name || 'No facility selected'}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
