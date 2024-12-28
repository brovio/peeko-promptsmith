import { FilterSheet } from "./FilterSheet";
import { Button } from "@/components/ui/button";
import { Sun, Moon, CircleDot } from "lucide-react";
import { useThemeManager } from "@/hooks/use-theme-manager";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModelsHeaderProps {
  providers: string[];
  maxContextLength: number;
  selectedProvider: string;
  contextLength: number[];
  onProviderChange: (provider: string) => void;
  onContextLengthChange: (length: number[]) => void;
}

export function ModelsHeader({
  providers,
  maxContextLength,
  selectedProvider,
  contextLength,
  onProviderChange,
  onContextLengthChange,
}: ModelsHeaderProps) {
  const { applyTheme } = useThemeManager();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Available Models</h1>
      <div className="flex gap-2">
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
                  <Sun className="h-4 w-4" />
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
                  <Moon className="h-4 w-4" />
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
                  <CircleDot className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Black Theme</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <FilterSheet
          providers={providers}
          maxContextLength={maxContextLength}
          selectedProvider={selectedProvider}
          contextLength={contextLength}
          onProviderChange={onProviderChange}
          onContextLengthChange={onContextLengthChange}
        />
      </div>
    </div>
  );
}