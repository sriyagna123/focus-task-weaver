import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListTodo, Plus } from "lucide-react";

const TaskManager = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCount] = useState(0);

  const handleAddTask = () => {
    // TODO: Save to database
    setTaskTitle("");
  };

  return (
    <Card className="backdrop-blur-sm bg-card/95 border-feature-orange/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-feature-orange flex items-center justify-center">
            <ListTodo className="w-5 h-5 text-white" />
          </div>
          Task Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 rounded-lg bg-gradient-to-br from-feature-orange/10 to-feature-orange/5 border border-feature-orange/20">
          <div className="text-sm text-muted-foreground mb-1">Active Tasks</div>
          <div className="text-3xl font-bold text-foreground">{taskCount}</div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task">New Task</Label>
            <Input
              id="task"
              placeholder="Assignment, exam, project deadline..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleAddTask}
            className="w-full"
            disabled={!taskTitle}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Coming soon: Alert notifications and priority-based organization
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskManager;
