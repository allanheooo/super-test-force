import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/home", icon: Home, label: "Home", emoji: "🏠" },
    { path: "/analytics", icon: BarChart3, label: "Analytics", emoji: "📊" },
    { path: "/settings", icon: Settings, label: "Settings", emoji: "⚙️" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-water-medium/20 shadow-lg z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ path, icon: Icon, label, emoji }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 rounded-lg mx-1",
              location.pathname === path
                ? "text-primary bg-water-light scale-105 shadow-sm"
                : "text-muted-foreground hover:text-primary hover:bg-water-light/50"
            )}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium flex items-center gap-1">
              {emoji} {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;