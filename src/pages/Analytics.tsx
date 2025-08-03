import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Analytics = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [waterLogs, setWaterLogs] = useState<Record<string, any>>({});
  const [preferences, setPreferences] = useState<any>(null);

  useEffect(() => {
    // Load preferences
    const savedPrefs = localStorage.getItem("hydrotracker_preferences");
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }

    // Load all water logs
    const logs: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("hydrotracker_") && key !== "hydrotracker_preferences") {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          logs[parsed.date] = parsed;
        }
      }
    }
    setWaterLogs(logs);
  }, []);

  const calculateStats = () => {
    const logs = Object.values(waterLogs);
    const totalBottles = logs.reduce((sum, log) => sum + (log.bottles || 0), 0);
    const goalsMetDays = logs.filter(log => preferences && log.bottles >= preferences.dailyGoal).length;
    const dailyAverage = logs.length > 0 ? totalBottles / logs.length : 0;
    
    // Calculate current streak
    const sortedDates = Object.keys(waterLogs).sort();
    let streak = 0;
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const date = sortedDates[i];
      const log = waterLogs[date];
      if (preferences && log.bottles >= preferences.dailyGoal) {
        streak++;
      } else {
        break;
      }
    }

    return {
      totalBottles,
      dailyAverage: Math.round(dailyAverage * 10) / 10,
      dayStreak: streak,
      goalsMetDays,
    };
  };

  const stats = calculateStats();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const today = new Date();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const log = waterLogs[dateStr];
      const bottles = log?.bottles || 0;
      const isFuture = date > today;
      const goalMet = preferences && bottles >= preferences.dailyGoal;
      
      days.push(
        <div
          key={day}
          className={`h-12 flex flex-col items-center justify-center text-sm border-2 rounded-lg transition-all duration-200 ${
            isFuture 
              ? 'text-muted-foreground bg-muted/30 border-muted' 
              : goalMet 
                ? 'bg-gradient-to-b from-success/20 to-success/30 text-success border-success/50 shadow-sm' 
                : bottles > 0 
                  ? 'bg-gradient-to-b from-water-light to-water-medium/30 text-primary border-water-medium/50'
                  : 'bg-background border-border hover:border-water-medium/30'
          }`}
        >
          <span className="font-bold">{day}</span>
          {!isFuture && bottles > 0 && (
            <span className="text-xs font-semibold">
              {goalMet ? '🏆' : '💧'} {bottles}
            </span>
          )}
        </div>
      );
    }
    
    return days;
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-water-light via-background to-water-medium pb-20">
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            📊 Analytics
          </h1>
          <p className="text-muted-foreground mt-2">Track your hydration journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center border-2 border-primary/20 bg-gradient-to-b from-card to-primary/10">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-primary mb-1">💧</div>
              <div className="text-2xl font-bold text-primary">{stats.totalBottles}</div>
              <div className="text-sm text-muted-foreground">Total Bottles</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-2 border-accent/30 bg-gradient-to-b from-card to-accent/20">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-accent-foreground mb-1">📈</div>
              <div className="text-2xl font-bold text-primary">{stats.dailyAverage}</div>
              <div className="text-sm text-muted-foreground">Daily Average</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-2 border-success/30 bg-gradient-to-b from-card to-success/20">
            <CardContent className="p-4">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-primary">{stats.dayStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-2 border-warning/30 bg-gradient-to-b from-card to-warning/20">
            <CardContent className="p-4">
              <div className="text-3xl mb-1">🏆</div>
              <div className="text-2xl font-bold text-primary">{stats.goalsMetDays}</div>
              <div className="text-sm text-muted-foreground">Goals Met</div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card className="border-2 border-water-medium/20 bg-gradient-to-b from-card to-water-light/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')} className="hover:bg-water-light">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-lg flex items-center gap-2">
                📅 {monthName}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')} className="hover:bg-water-light">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-sm font-bold text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;