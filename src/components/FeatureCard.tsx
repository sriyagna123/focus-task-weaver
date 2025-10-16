import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  iconColor: string;
}

const FeatureCard = ({ icon: Icon, title, description, features, iconColor }: FeatureCardProps) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-card rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border cursor-pointer hover:scale-105"
    >
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: iconColor }}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-foreground mb-4">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary mt-0.5">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeatureCard;
