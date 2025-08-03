import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Undo2, Settings, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Home = () => {
  const [bottleCount, setBottleCount] = useState(0);
  const [preferences, setPreferences] = useState<any>(null);
  const [hasShownCongrats, setHasShownCongrats] = useState(false);

  useEffect(() => {
    // Load preferences
    const savedPrefs = localStorage.getItem("hydrotracker_preferences");
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }

    // Load today's bottle count
    const today = new Date().toISOString().split('T')[0];
    const todayData = localStorage.getItem(`hydrotracker_${today}`);
    if (todayData) {
      const data = JSON.parse(todayData);
      setBottleCount(data.bottles || 0);
      setHasShownCongrats(data.congratsShown || false);
    }
  }, []);

  const saveTodayData = (bottles: number, congratsShown: boolean = hasShownCongrats) => {
    const today = new Date().toISOString().split('T')[0];
    const data = { bottles, congratsShown, date: today };
    localStorage.setItem(`hydrotracker_${today}`, JSON.stringify(data));
  };

  const addBottle = () => {
    const newCount = bottleCount + 1;
    setBottleCount(newCount);
    saveTodayData(newCount);

    // Show congratulations if goal reached for the first time today
    if (preferences && newCount >= preferences.dailyGoal && !hasShownCongrats) {
      toast({
        title: "🎉 Congratulations!",
        description: "You've reached your daily hydration goal!",
      });
      setHasShownCongrats(true);
      saveTodayData(newCount, true);
    }
  };

  const removeBottle = () => {
    if (bottleCount > 0) {
      const newCount = bottleCount - 1;
      setBottleCount(newCount);
      saveTodayData(newCount);
    }
  };

  if (!preferences) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading preferences...</p>
        </div>
      </div>
    );
  }

  const progress = (bottleCount / preferences.dailyGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-light via-background to-water-medium pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card/90 backdrop-blur-sm border-b border-water-medium/20 shadow-sm">
        <Droplets className="h-8 w-8 text-primary animate-wave" />
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          💧 HydroTracker
        </h1>
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="hover:bg-water-light transition-colors">
            <Settings className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Progress Card */}
        <Card className="text-center border-2 border-primary/20 bg-gradient-to-b from-card to-water-light/30 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-5xl font-bold text-primary mb-2 animate-bounce-gentle">
              {bottleCount} / {preferences.dailyGoal}
            </div>
            <p className="text-muted-foreground mb-4 flex items-center justify-center gap-2">
              🍼 bottles today {bottleCount >= preferences.dailyGoal && "🎉"}
            </p>
            <div className="relative mb-4">
              <Progress 
                value={Math.min(progress, 100)} 
                className="h-4 bg-water-light border" 
              />
              {progress >= 100 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white drop-shadow-lg">
                    🏆 GOAL REACHED!
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              💧 {preferences.bottleSize}{preferences.unit} bottles
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={addBottle} 
            size="lg" 
            className="w-full text-lg py-6 bg-gradient-to-r from-primary to-water-dark hover:from-primary/90 hover:to-water-dark/90 transition-all duration-300 animate-water-drop shadow-lg"
          >
            <Plus className="h-6 w-6 mr-2" />
            💧 +1 Bottle
          </Button>
          
          <Button 
            onClick={removeBottle} 
            variant="outline" 
            size="lg" 
            className="w-full border-2 border-muted hover:bg-muted/20 transition-colors"
            disabled={bottleCount === 0}
          >
            <Undo2 className="h-5 w-5 mr-2" />
            ↩️ Undo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;