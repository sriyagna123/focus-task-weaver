import FeatureCard from "./FeatureCard";
import { Calendar, DollarSign, ListTodo } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Attendance Tracker",
      description: "Track daily college attendance and monitor your percentage in real-time. Never miss the minimum attendance requirement.",
      features: [
        "Real-time percentage calculation",
        "Subject-wise tracking"
      ],
      iconColor: "hsl(var(--feature-purple))"
    },
    {
      icon: DollarSign,
      title: "Expense Tracker",
      description: "Manage your money wisely with detailed expense tracking. View spending patterns across different time periods.",
      features: [
        "Daily, weekly, monthly, yearly recaps",
        "Category-based tracking"
      ],
      iconColor: "hsl(var(--feature-green))"
    },
    {
      icon: ListTodo,
      title: "Task Manager",
      description: "Stay organized with smart task management. Never forget assignments, exams, or important deadlines again.",
      features: [
        "Alert notification system",
        "Priority-based organization"
      ],
      iconColor: "hsl(var(--feature-orange))"
    }
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground">
            Three powerful tools designed specifically for college students
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
