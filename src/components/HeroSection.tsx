import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 tech-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Unlock the Power of Your{" "}
            <span className="glow-blue text-primary">Equipment Data</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Upload your equipment nameplates. We'll handle the rest — from specs to insights.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground pt-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-glow" />
            <span>Automated. Accurate. Nexum Suum Smart.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
