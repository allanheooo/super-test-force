import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const Onboarding = () => {
  const [bottleSize, setBottleSize] = useState("");
  const [unit, setUnit] = useState("oz");
  const [dailyGoal, setDailyGoal] = useState("");
  const navigate = useNavigate();

  const handleStartTracking = () => {
    if (!bottleSize || !dailyGoal) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const preferences = {
        bottleSize: parseFloat(bottleSize),
        unit,
        dailyGoal: parseInt(dailyGoal),
        onboardingComplete: true,
      };

      localStorage.setItem("hydrotracker_preferences", JSON.stringify(preferences));
      navigate("/home");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">💧</div>
          <CardTitle className="text-2xl text-primary">Welcome to HydroTracker</CardTitle>
          <p className="text-muted-foreground">Let's set up your hydration goals</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bottleSize">Bottle Size</Label>
            <div className="flex gap-2">
              <Input
                id="bottleSize"
                type="number"
                placeholder="16"
                value={bottleSize}
                onChange={(e) => setBottleSize(e.target.value)}
                className="flex-1"
              />
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oz">oz</SelectItem>
                  <SelectItem value="mL">mL</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyGoal">Daily Goal (bottles)</Label>
            <Input
              id="dailyGoal"
              type="number"
              placeholder="6"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
            />
          </div>

          <Button onClick={handleStartTracking} className="w-full" size="lg">
            Start Tracking
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;