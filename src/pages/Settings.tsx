import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
const Settings = () => {
  const [preferences, setPreferences] = useState<any>(null);
  const [bottleSize, setBottleSize] = useState("");
  const [unit, setUnit] = useState("oz");
  const [dailyGoal, setDailyGoal] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const savedPrefs = localStorage.getItem("hydrotracker_preferences");
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setPreferences(prefs);
      setBottleSize(prefs.bottleSize.toString());
      setUnit(prefs.unit);
      setDailyGoal(prefs.dailyGoal.toString());
    }
  }, []);
  const savePreferences = () => {
    if (!bottleSize || !dailyGoal) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    const newPrefs = {
      ...preferences,
      bottleSize: parseFloat(bottleSize),
      unit,
      dailyGoal: parseInt(dailyGoal)
    };
    localStorage.setItem("hydrotracker_preferences", JSON.stringify(newPrefs));
    setPreferences(newPrefs);
    toast({
      title: "Success",
      description: "Preferences updated successfully"
    });
  };
  const resetTodayProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.removeItem(`hydrotracker_${today}`);
    toast({
      title: "Success",
      description: "Today's progress has been reset"
    });
  };
  const clearAllWaterLogs = () => {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("hydrotracker_") && key !== "hydrotracker_preferences") {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    toast({
      title: "Success",
      description: "All water logs have been cleared"
    });
  };
  const clearAllData = () => {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("hydrotracker_")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    navigate("/");
    toast({
      title: "Success",
      description: "All data cleared. Returning to onboarding."
    });
  };
  if (!preferences) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-water-light via-background to-water-medium pb-20">
      <div className="p-6 space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">Settings</h1>
          <p className="text-muted-foreground mt-2">Customize your hydration experience</p>
        </div>

        {/* Account Info */}
        <Card className="border-2 border-water-medium/20 bg-gradient-to-r from-card to-water-light/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👤 Account Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground flex items-center gap-2">
              No account - using local storage
            </p>
          </CardContent>
        </Card>

        {/* User Preferences */}
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 User Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bottleSize" className="flex items-center gap-2">
                Bottle Size
              </Label>
              <div className="flex gap-2">
                <Input id="bottleSize" type="number" value={bottleSize} onChange={e => setBottleSize(e.target.value)} className="flex-1 border-water-medium/30 focus:border-primary" placeholder="16" />
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger className="w-20 border-water-medium/30">
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
              <Label htmlFor="dailyGoal" className="flex items-center gap-2">
                Daily Goal (bottles)
              </Label>
              <Input id="dailyGoal" type="number" value={dailyGoal} onChange={e => setDailyGoal(e.target.value)} className="border-water-medium/30 focus:border-primary" placeholder="8" />
            </div>

            <Button onClick={savePreferences} className="w-full bg-gradient-to-r from-primary to-water-dark hover:from-primary/90 hover:to-water-dark/90 transition-all duration-300">
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-2 border-destructive/20 bg-gradient-to-r from-card to-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              🗂️ Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full border-warning/30 hover:bg-warning/10">
                  Reset Today's Progress
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Today's Progress</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset your bottle count for today to 0. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetTodayProgress}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full border-destructive/30 hover:bg-destructive/10">
                  Clear All Water Logs
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Water Logs</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all your water tracking history from the database. Your preferences will be kept. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllWaterLogs} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70">
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset the entire app to its initial state, clearing all preferences and water logs. You will be returned to the onboarding screen. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Clear Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-2 border-accent/30 bg-gradient-to-r from-card to-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ℹ️ About
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-primary font-semibold text-lg">HydroTracker v1.0</p>
            <p className="text-muted-foreground text-sm mt-1 flex items-center justify-center gap-1">
              Built with using Lovable
            </p>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Settings;