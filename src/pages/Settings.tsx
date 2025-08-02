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
        variant: "destructive",
      });
      return;
    }

    const newPrefs = {
      ...preferences,
      bottleSize: parseFloat(bottleSize),
      unit,
      dailyGoal: parseInt(dailyGoal),
    };

    localStorage.setItem("hydrotracker_preferences", JSON.stringify(newPrefs));
    setPreferences(newPrefs);
    
    toast({
      title: "Success",
      description: "Preferences updated successfully",
    });
  };

  const resetTodayProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.removeItem(`hydrotracker_${today}`);
    
    toast({
      title: "Success",
      description: "Today's progress has been reset",
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
      description: "All water logs have been cleared",
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
      description: "All data cleared. Returning to onboarding.",
    });
  };

  if (!preferences) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-primary">Settings</h1>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No account - using local storage</p>
          </CardContent>
        </Card>

        {/* User Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>User Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bottleSize">Bottle Size</Label>
              <div className="flex gap-2">
                <Input
                  id="bottleSize"
                  type="number"
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
                value={dailyGoal}
                onChange={(e) => setDailyGoal(e.target.value)}
              />
            </div>

            <Button onClick={savePreferences} className="w-full">
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
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
                <Button variant="outline" className="w-full">
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
                <Button variant="destructive" className="w-full">
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
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">HydroTracker v1.0</p>
            <p className="text-muted-foreground text-sm mt-1">Built with Lovable</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;