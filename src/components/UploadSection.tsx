import { Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const UploadSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Upload Engine
            </h2>
            <p className="text-muted-foreground">
              Drop your nameplate images and let our AI extract the specs
            </p>
          </div>

          <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center hover:border-primary/60 transition-all bg-card/50 backdrop-blur-sm group cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:border-glow-blue transition-all">
                <Image className="w-10 h-10 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium mb-1">
                  Drag & drop your nameplate images
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (JPEG, PNG supported)
                </p>
              </div>
              <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50 shadow-lg hover:shadow-primary/50 transition-all">
                <Upload className="w-4 h-4 mr-2" />
                Extract Specs & Generate Analysis
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Supports motors, pumps, chillers, boilers, compressors & more
          </p>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
