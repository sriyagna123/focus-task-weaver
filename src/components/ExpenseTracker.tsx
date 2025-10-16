import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Plus } from "lucide-react";

const ExpenseTracker = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [totalExpenses] = useState(0);

  const handleAddExpense = () => {
    // TODO: Save to database
    setAmount("");
    setCategory("");
  };

  return (
    <Card className="backdrop-blur-sm bg-card/95 border-feature-green/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-feature-green flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          Expense Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 rounded-lg bg-gradient-to-br from-feature-green/10 to-feature-green/5 border border-feature-green/20">
          <div className="text-sm text-muted-foreground mb-1">Total Expenses</div>
          <div className="text-3xl font-bold text-foreground">${totalExpenses.toFixed(2)}</div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="Food, Transport, etc."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleAddExpense}
            className="w-full"
            disabled={!amount || !category}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Coming soon: Daily, weekly, monthly, and yearly expense recaps
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseTracker;
