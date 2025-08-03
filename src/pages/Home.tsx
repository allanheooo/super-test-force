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
    <div className="min-h-screen bg-gradient-primary pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <Droplets className="h-8 w-8 text-white/80" />
        <h1 className="text-2xl font-bold text-white">
          HydroTracker
        </h1>
        <Link to="/settings">
          <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white/80">
            <Settings className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-6">
        {/* Today's Progress Header */}
        <div className="text-white/90 mb-6">
          <h2 className="text-3xl font-light mb-1">Today's Progress</h2>
          <p className="text-white/70">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Large Progress Display */}
        <div className="text-center text-white mb-8">
          <div className="text-8xl font-light mb-2">
            {bottleCount}
          </div>
          <p className="text-xl text-white/80 mb-1">
            of {preferences.dailyGoal} bottles
          </p>
          <p className="text-white/60">
            {bottleCount * preferences.bottleSize} / {preferences.dailyGoal * preferences.bottleSize} {preferences.unit}
          </p>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-muted-foreground">Daily Progress</h3>
              <span className="text-lg font-semibold text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            
            <div className="relative mb-6">
              <Progress 
                value={Math.min(progress, 100)} 
                className="h-3 bg-muted rounded-full" 
              />
            </div>

            {/* Water Drop Indicators */}
            <div className="flex justify-center gap-3 mb-4">
              {Array.from({ length: preferences.dailyGoal }, (_, i) => (
                <div key={i} className="relative">
                  <Droplets 
                    className={`h-8 w-8 ${
                      i < bottleCount 
                        ? 'text-primary fill-primary' 
                        : 'text-muted stroke-muted-foreground/30'
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button 
          onClick={addBottle} 
          size="lg" 
          className="w-full text-lg py-6 bg-ios-green hover:bg-ios-green-dark text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 active:scale-95"
        >
          <Plus className="h-6 w-6 mr-2" />
          Add 1 Bottle ({preferences.bottleSize} {preferences.unit})
        </Button>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success mb-1">
                {bottleCount}
              </div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning mb-1">
                {bottleCount > 0 ? '17h 14m' : '--'}
              </div>
              <p className="text-sm text-muted-foreground">Until Reset</p>
            </CardContent>
          </Card>
        </div>

        {/* Undo Button */}
        {bottleCount > 0 && (
          <Button 
            onClick={removeBottle} 
            variant="ghost" 
            size="lg" 
            className="w-full text-white/70 hover:bg-white/10 transition-colors rounded-2xl"
          >
            <Undo2 className="h-5 w-5 mr-2" />
            Undo Last Bottle
          </Button>
        )}
      </div>
    </div>
  );
};

export default Home;