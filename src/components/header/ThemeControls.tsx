import { Sun, Moon, CircleDot } from "lucide-react";
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
      <div className="flex items-center space-x-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => applyTheme('light')}
              className="p-2 hover:bg-accent rounded-md group"
            >
              <Sun className="h-5 w-5 dark:text-primary black:text-primary group-hover:text-primary" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Light Theme</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => applyTheme('dark')}
              className="p-2 hover:bg-accent rounded-md group"
            >
              <Moon className="h-5 w-5 dark:text-primary black:text-primary group-hover:text-primary" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dark Theme</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => applyTheme('black')}
              className="p-2 hover:bg-accent rounded-md group"
            >
              <CircleDot className="h-5 w-5 dark:text-primary black:text-primary group-hover:text-primary" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Black Theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}