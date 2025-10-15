import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Calendar, Save, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AttendanceTracker = () => {
  const [totalClasses, setTotalClasses] = useState<number>(0);
  const [attendedClasses, setAttendedClasses] = useState<number>(0);
  const [requiredPercentage, setRequiredPercentage] = useState<number>(75);
  const [currentPercentage, setCurrentPercentage] = useState<number>(0);
  const [classesNeeded, setClassesNeeded] = useState<number>(0);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load saved data
  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data && !error) {
        setRecordId(data.id);
        setTotalClasses(data.total_classes);
        setAttendedClasses(data.attended_classes);
        setRequiredPercentage(data.required_percentage);
      }
    };

    loadData();
  }, []);

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

  const saveAttendance = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to save your data",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    const attendanceData = {
      user_id: user.id,
      total_classes: totalClasses,
      attended_classes: attendedClasses,
      required_percentage: requiredPercentage,
    };

    let error;
    if (recordId) {
      const result = await supabase
        .from('attendance_records')
        .update(attendanceData)
        .eq('id', recordId);
      error = result.error;
    } else {
      const result = await supabase
        .from('attendance_records')
        .insert([attendanceData])
        .select()
        .single();
      error = result.error;
      if (result.data) setRecordId(result.data.id);
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved!",
        description: "Your attendance data has been saved.",
      });
    }

    setSaving(false);
  };

  const pieData = [
    { name: 'Attended', value: attendedClasses, color: 'hsl(var(--feature-green))' },
    { name: 'Missed', value: Math.max(0, totalClasses - attendedClasses), color: 'hsl(var(--destructive))' },
  ];

  const missedClasses = totalClasses - attendedClasses;

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-card via-card/95 to-card/90 shadow-2xl border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-feature-purple/10 to-primary/10 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Attendance Tracker</CardTitle>
              <CardDescription>
                Monitor your progress and stay on track
              </CardDescription>
            </div>
          </div>
          <Button onClick={saveAttendance} disabled={saving} size="sm">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="total-classes" className="text-sm font-semibold">Total Classes</Label>
            <Input
              id="total-classes"
              type="number"
              min="0"
              value={totalClasses || ""}
              onChange={(e) => setTotalClasses(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attended-classes" className="text-sm font-semibold">Classes Attended</Label>
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
              placeholder="0"
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="required-percentage" className="text-sm font-semibold">Required %</Label>
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
              className="text-lg font-semibold"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Attended</p>
                  <p className="text-2xl font-bold text-feature-green">{attendedClasses}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-feature-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Missed</p>
                  <p className="text-2xl font-bold text-destructive">{missedClasses}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-feature-orange/5 border-feature-orange/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Need to Attend</p>
                  <p className="text-2xl font-bold text-feature-orange">{classesNeeded}</p>
                </div>
                <Calendar className="w-8 h-8 text-feature-orange" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Stats and Chart */}
        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Current Attendance</span>
              <span className={`text-3xl font-bold ${getPercentageColor()}`}>
                {currentPercentage.toFixed(1)}%
              </span>
            </div>

            <Progress value={currentPercentage} className="h-4" />

            <div className="bg-muted/50 rounded-xl p-5 space-y-3 border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Total Classes</span>
                <span className="font-bold">{totalClasses}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Classes Attended</span>
                <span className="font-bold text-feature-green">{attendedClasses}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Classes Missed</span>
                <span className="font-bold text-destructive">{missedClasses}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground font-medium">Required %</span>
                <span className="font-bold">{requiredPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          {totalClasses > 0 && (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
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
      </CardContent>
    </Card>
  );
};

export default AttendanceTracker;
