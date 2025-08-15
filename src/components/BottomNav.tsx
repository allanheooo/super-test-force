import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-muted/20 shadow-2xl z-50 rounded-t-3xl pb-safe">
      <div className="flex items-center justify-around h-20 px-4 pt-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 rounded-2xl mx-1 py-2",
              location.pathname === path
                ? "text-ios-blue bg-ios-blue-light/20 scale-105"
                : "text-muted-foreground hover:text-ios-blue hover:bg-ios-blue-light/10"
            )}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;