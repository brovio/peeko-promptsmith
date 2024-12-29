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
      <div className="flex items-center space-x-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => applyTheme('light')}
              className="p-2 rounded-md group"
            >
              <Sun className="h-8 w-8 text-[hsl(142,76%,36%)] group-hover:text-white transition-colors" />
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
              className="p-2 rounded-md group"
            >
              <Moon className="h-8 w-8 text-[hsl(142,76%,36%)] group-hover:text-white transition-colors" />
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
              className="p-2 rounded-md group"
            >
              <CircleDot className="h-8 w-8 text-[hsl(142,76%,36%)] group-hover:text-white transition-colors" />
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