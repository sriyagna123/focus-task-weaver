import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CallToAction from "@/components/CallToAction";
import AttendanceTracker from "@/components/AttendanceTracker";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      
      {/* Interactive Attendance Tracker Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Try the Attendance Tracker
            </h2>
            <p className="text-lg text-muted-foreground">
              Calculate your attendance and see how many classes you need
            </p>
          </div>
          <AttendanceTracker />
        </div>
      </section>
      
      <CallToAction />
    </div>
  );
};

export default Index;
