import { Sun, Moon, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useThemeManager } from "@/hooks/use-theme-manager";

export function ThemeControls() {
  const { applyTheme } = useThemeManager();

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => applyTheme('light')}
              className="w-[50px] h-[50px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Sun className="h-[40px] w-[40px] my-[5px] dark:text-primary black:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" sideOffset={5}>
            <p>Light</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => applyTheme('dark')}
              className="w-[50px] h-[50px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Moon className="h-[40px] w-[40px] my-[5px] dark:text-primary black:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" sideOffset={5}>
            <p>Dark</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => applyTheme('black')}
              className="w-[50px] h-[50px] bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <CircleDot className="h-[40px] w-[40px] my-[5px] dark:text-primary black:text-primary" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" sideOffset={5}>
            <p>Black</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}