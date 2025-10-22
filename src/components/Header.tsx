import { Upload } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/50 flex items-center justify-center">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Nexum Suum</h1>
            <p className="text-xs text-muted-foreground">Equipment Intelligence</p>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Portal
          </a>
          <button className="px-4 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20 transition-all">
            Log In
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
