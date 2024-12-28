import { ColorTheme } from "@/lib/colorUtils";
import { useThemeManager } from "@/hooks/use-theme-manager";
import { Button } from "@/components/ui/button";
import { Sun, Moon, CircleDot } from "lucide-react";

// Predefined themes with HSL values
const lightTheme: ColorTheme = {
  background: "0 0% 100%",
  foreground: "220 10% 15%",
  primary: "221 83% 53%",
  secondary: "220 14% 96%",
  accent: "221 83% 53%"
};

const darkTheme: ColorTheme = {
  background: "220 10% 15%",
  foreground: "210 40% 98%",
  primary: "142 76% 36%",
  secondary: "220 14% 24%",
  accent: "142 76% 36%"
};

const blackTheme: ColorTheme = {
  background: "0 0% 0%",
  foreground: "0 0% 100%",
  primary: "142 76% 36%",
  secondary: "0 0% 10%",
  accent: "142 76% 36%"
};

export function ThemeSettings() {
  const { applyTheme } = useThemeManager();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Theme</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => applyTheme(lightTheme)}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <Sun className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => applyTheme(darkTheme)}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <Moon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => applyTheme(blackTheme)}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <CircleDot className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}