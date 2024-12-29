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
    <TooltipProvider delayDuration={300}>
      <div className="flex gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => applyTheme('light')}
              className="w-[100px] h-[100px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Sun className="h-[100px] w-[100px] dark:text-primary black:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" sideOffset={5}>
            <p>Light Theme</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => applyTheme('dark')}
              className="w-[100px] h-[100px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Moon className="h-[100px] w-[100px] dark:text-primary black:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" sideOffset={5}>
            <p>Dark Theme</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => applyTheme('black')}
              className="w-[100px] h-[100px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <CircleDot className="h-[100px] w-[100px] dark:text-primary black:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" sideOffset={5}>
            <p>Black Theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}