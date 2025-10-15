import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="bg-gradient-primary py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Take Control?
        </h2>
        <p className="text-lg text-white/90 mb-8">
          Start tracking your success today with Smart Tracking System
        </p>
        <Link to="/dashboard">
          <Button 
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300"
          >
            Launch Dashboard
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
