import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const preferences = localStorage.getItem("hydrotracker_preferences");
    if (preferences) {
      const prefs = JSON.parse(preferences);
      if (prefs.onboardingComplete) {
        navigate("/home");
        return;
      }
    }
    // If no preferences or onboarding not complete, go to onboarding
    navigate("/onboarding");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
