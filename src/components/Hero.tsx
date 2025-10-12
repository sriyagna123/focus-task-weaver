import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-[500px] bg-gradient-primary flex items-center justify-center px-6 py-20">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Smart Tracking System
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Master your college life with intelligent attendance tracking, expense management, 
          and task organization - all in one place.
        </p>
        <Button 
          size="lg" 
          className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300"
        >
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default Hero;
