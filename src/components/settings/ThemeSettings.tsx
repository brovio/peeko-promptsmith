import { useThemeManager } from "@/hooks/use-theme-manager";
import { Button } from "@/components/ui/button";
import { Sun, Moon, CircleDot } from "lucide-react";

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
            onClick={() => applyTheme('light')}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <Sun className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => applyTheme('dark')}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <Moon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => applyTheme('black')}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <CircleDot className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}