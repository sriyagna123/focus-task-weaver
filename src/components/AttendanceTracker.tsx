import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "lucide-react";

const AttendanceTracker = () => {
  const [totalClasses, setTotalClasses] = useState<number>(0);
  const [attendedClasses, setAttendedClasses] = useState<number>(0);
  const [requiredPercentage, setRequiredPercentage] = useState<number>(75);
  const [currentPercentage, setCurrentPercentage] = useState<number>(0);
  const [classesNeeded, setClassesNeeded] = useState<number>(0);

  useEffect(() => {
    if (totalClasses > 0) {
      const percentage = (attendedClasses / totalClasses) * 100;
      setCurrentPercentage(percentage);

      // Calculate classes needed to reach required percentage
      // Formula: (attendedClasses + x) / (totalClasses + x) = requiredPercentage / 100
      // Solving for x: x = (requiredPercentage * totalClasses - 100 * attendedClasses) / (100 - requiredPercentage)
      if (percentage < requiredPercentage) {
        const needed = Math.ceil(
          (requiredPercentage * totalClasses - 100 * attendedClasses) / 
          (100 - requiredPercentage)
        );
        setClassesNeeded(Math.max(0, needed));
      } else {
        setClassesNeeded(0);
      }
    } else {
      setCurrentPercentage(0);
      setClassesNeeded(0);
    }
  }, [totalClasses, attendedClasses, requiredPercentage]);

  const getPercentageColor = () => {
    if (currentPercentage >= requiredPercentage) return "text-feature-green";
    if (currentPercentage >= requiredPercentage - 10) return "text-feature-orange";
    return "text-destructive";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-feature-purple flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Attendance Tracker</CardTitle>
            <CardDescription>
              Track your classes and monitor your attendance percentage
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="total-classes">Total Number of Classes</Label>
            <Input
              id="total-classes"
              type="number"
              min="0"
              value={totalClasses || ""}
              onChange={(e) => setTotalClasses(parseInt(e.target.value) || 0)}
              placeholder="Enter total classes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attended-classes">Classes Attended</Label>
            <Input
              id="attended-classes"
              type="number"
              min="0"
              max={totalClasses}
              value={attendedClasses || ""}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setAttendedClasses(Math.min(value, totalClasses));
              }}
              placeholder="Enter attended classes"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="required-percentage">Required Percentage (%)</Label>
          <Input
            id="required-percentage"
            type="number"
            min="0"
            max="100"
            value={requiredPercentage}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0;
              setRequiredPercentage(Math.min(100, Math.max(0, value)));
            }}
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Current Attendance</span>
            <span className={`text-2xl font-bold ${getPercentageColor()}`}>
              {currentPercentage.toFixed(1)}%
            </span>
          </div>

          <Progress value={currentPercentage} className="h-3" />

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Classes Attended</span>
              <span className="font-medium">{attendedClasses} / {totalClasses}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Required Percentage</span>
              <span className="font-medium">{requiredPercentage}%</span>
            </div>
          </div>

          {totalClasses > 0 && currentPercentage < requiredPercentage && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">
                Classes Needed to Reach {requiredPercentage}%
              </p>
              <p className="text-2xl font-bold text-primary">
                {classesNeeded} {classesNeeded === 1 ? 'class' : 'classes'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                You need to attend {classesNeeded} more consecutive {classesNeeded === 1 ? 'class' : 'classes'} to reach your required percentage
              </p>
            </div>
          )}

          {totalClasses > 0 && currentPercentage >= requiredPercentage && (
            <div className="bg-feature-green/10 border border-feature-green/20 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">
                ✓ You're above the required percentage!
              </p>
              <p className="text-xs text-muted-foreground">
                Keep up the good work maintaining your attendance
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTracker;
