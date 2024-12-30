import { Sun, Moon, CircleDot } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useThemeManager } from "@/hooks/use-theme-manager";
import { Theme } from "@/types/theme";

const defaultThemes: Record<string, Theme> = {
  light: {
    id: 'light',
    name: 'Light Theme',
    theme_type: 'light',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    input_text: '222.2 84% 4.9%',
    dropdown_bg: '0 0% 100%',
    dropdown_text: '222.2 84% 4.9%',
    search_bg: '0 0% 100%',
    search_text: '222.2 84% 4.9%',
    filter_bg: '0 0% 100%',
    filter_text: '222.2 84% 4.9%',
    icon: '222.2 84% 4.9%',
    divider: '214.3 31.8% 91.4%',
    card: '0 0% 100%',
    card_foreground: '222.2 84% 4.9%',
    popover: '0 0% 100%',
    popover_foreground: '222.2 84% 4.9%',
    primary_color: '222.2 47.4% 11.2%',
    primary_foreground: '210 40% 98%',
    secondary: '210 40% 96.1%',
    secondary_foreground: '222.2 47.4% 11.2%',
    muted: '210 40% 96.1%',
    muted_foreground: '215.4 16.3% 46.9%',
    accent: '210 40% 96.1%',
    accent_foreground: '222.2 47.4% 11.2%',
    destructive: '0 84.2% 60.2%',
    destructive_foreground: '210 40% 98%',
    border: '214.3 31.8% 91.4%',
    input: '214.3 31.8% 91.4%',
    ring: '222.2 84% 4.9%',
  },
  dark: {
    id: 'dark',
    name: 'Dark Theme',
    theme_type: 'dark',
    background: '222.2 84% 4.9%',
    foreground: '210 40% 98%',
    input_text: '210 40% 98%',
    dropdown_bg: '217.2 32.6% 17.5%',
    dropdown_text: '210 40% 98%',
    search_bg: '217.2 32.6% 17.5%',
    search_text: '210 40% 98%',
    filter_bg: '217.2 32.6% 17.5%',
    filter_text: '210 40% 98%',
    icon: '210 40% 98%',
    divider: '217.2 32.6% 17.5%',
    card: '222.2 84% 4.9%',
    card_foreground: '210 40% 98%',
    popover: '222.2 84% 4.9%',
    popover_foreground: '210 40% 98%',
    primary_color: '210 40% 98%',
    primary_foreground: '222.2 47.4% 11.2%',
    secondary: '217.2 32.6% 17.5%',
    secondary_foreground: '210 40% 98%',
    muted: '217.2 32.6% 17.5%',
    muted_foreground: '215 20.2% 65.1%',
    accent: '217.2 32.6% 17.5%',
    accent_foreground: '210 40% 98%',
    destructive: '0 62.8% 30.6%',
    destructive_foreground: '210 40% 98%',
    border: '217.2 32.6% 17.5%',
    input: '217.2 32.6% 17.5%',
    ring: '212.7 26.8% 83.9%',
  },
  black: {
    id: 'black',
    name: 'Black Theme',
    theme_type: 'peeko',
    background: '0 0% 13%',
    foreground: '0 0% 100%',
    input_text: '0 0% 100%',
    dropdown_bg: '0 0% 15%',
    dropdown_text: '0 0% 100%',
    search_bg: '0 0% 15%',
    search_text: '0 0% 100%',
    filter_bg: '0 0% 15%',
    filter_text: '0 0% 100%',
    icon: '142 76% 36%',
    divider: '0 0% 20%',
    card: '0 0% 15%',
    card_foreground: '0 0% 100%',
    popover: '0 0% 15%',
    popover_foreground: '0 0% 100%',
    primary_color: '142 76% 36%',
    primary_foreground: '0 0% 100%',
    secondary: '0 0% 20%',
    secondary_foreground: '0 0% 100%',
    muted: '0 0% 20%',
    muted_foreground: '0 0% 80%',
    accent: '142 76% 36%',
    accent_foreground: '0 0% 100%',
    destructive: '0 62.8% 30.6%',
    destructive_foreground: '0 0% 100%',
    border: '0 0% 20%',
    input: '0 0% 20%',
    ring: '142 76% 36%',
  }
};

export function ThemeSelector() {
  const { applyTheme } = useThemeManager();

  return (
    <>
      <DropdownMenuItem onClick={() => applyTheme(defaultThemes.light)}>
        <Sun className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
        Light Theme
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => applyTheme(defaultThemes.dark)}>
        <Moon className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
        Dark Theme
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => applyTheme(defaultThemes.black)}>
        <CircleDot className="mr-2 h-4 w-4 text-[hsl(142,76%,36%)]" />
        Black Theme
      </DropdownMenuItem>
    </>
  );
}