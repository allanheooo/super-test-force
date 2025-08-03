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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-water-light via-background to-water-medium">
      <Card className="w-full max-w-md border-2 border-primary/20 bg-gradient-to-b from-card to-water-light/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-bounce-gentle">💧</div>
          <CardTitle className="text-3xl text-primary mb-2">
            Welcome to HydroTracker
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Let's set up your hydration goals! 🎯
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="bottleSize" className="flex items-center gap-2 text-base font-medium">
              🍼 Bottle Size
            </Label>
            <div className="flex gap-2">
              <Input
                id="bottleSize"
                type="number"
                placeholder="16"
                value={bottleSize}
                onChange={(e) => setBottleSize(e.target.value)}
                className="flex-1 border-2 border-water-medium/30 focus:border-primary text-lg py-3"
              />
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="w-24 border-2 border-water-medium/30 text-lg py-3">
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

          <div className="space-y-3">
            <Label htmlFor="dailyGoal" className="flex items-center gap-2 text-base font-medium">
              🏆 Daily Goal (bottles)
            </Label>
            <Input
              id="dailyGoal"
              type="number"
              placeholder="8"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              className="border-2 border-water-medium/30 focus:border-primary text-lg py-3"
            />
          </div>

          <Button 
            onClick={handleStartTracking} 
            className="w-full bg-gradient-to-r from-primary to-water-dark hover:from-primary/90 hover:to-water-dark/90 text-lg py-4 shadow-lg transition-all duration-300" 
            size="lg"
          >
            🚀 Start Tracking
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;