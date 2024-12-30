import { Sun, Moon, CircleDot } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useThemeManager } from "@/hooks/use-theme-manager";

export function ThemeSelector() {
  const { applyTheme } = useThemeManager();

  return (
    <>
      <DropdownMenuItem onClick={() => applyTheme('light')}>
        <Sun className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
        Light Theme
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => applyTheme('dark')}>
        <Moon className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
        Dark Theme
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => applyTheme('black')}>
        <CircleDot className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
        Black Theme
      </DropdownMenuItem>
    </>
  );
}