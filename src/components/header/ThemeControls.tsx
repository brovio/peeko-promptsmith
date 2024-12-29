import { Sun, Moon, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeManager } from "@/hooks/use-theme-manager";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeControls() {
  const { applyTheme } = useThemeManager();

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => applyTheme('light')}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Sun className="h-4 w-4 dark:text-primary black:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Light Theme</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => applyTheme('dark')}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Moon className="h-4 w-4 dark:text-primary black:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dark Theme</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => applyTheme('black')}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <CircleDot className="h-4 w-4 dark:text-primary black:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Black Theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}