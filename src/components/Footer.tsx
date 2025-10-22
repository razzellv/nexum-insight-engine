import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-20 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the power of intelligent equipment management
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50 shadow-lg hover:shadow-primary/50 transition-all">
                <Zap className="w-5 h-5 mr-2" />
                Try the Tool Now
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                Log In to Nexum Portal
              </Button>
            </div>
          </div>

          <div className="pt-12 border-t border-border/50">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-6">
              <a href="#" className="hover:text-primary transition-colors">Support</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Licensing</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nexum Suum. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
