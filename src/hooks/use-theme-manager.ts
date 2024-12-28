import { useToast } from "@/hooks/use-toast";
import { ColorTheme } from "@/lib/colorUtils";

export function useThemeManager() {
  const { toast } = useToast();

  const applyTheme = (theme: ColorTheme) => {
    const root = document.documentElement;
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--foreground', theme.foreground);
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--accent', theme.accent);

    // Update other related variables to maintain consistency
    root.style.setProperty('--card', theme.background);
    root.style.setProperty('--card-foreground', theme.foreground);
    root.style.setProperty('--popover', theme.background);
    root.style.setProperty('--popover-foreground', theme.foreground);
    root.style.setProperty('--primary-foreground', "0 0% 100%");
    root.style.setProperty('--secondary-foreground', theme.foreground);
    root.style.setProperty('--muted', theme.secondary);
    root.style.setProperty('--muted-foreground', "220 8% 45%");
    root.style.setProperty('--accent-foreground', "0 0% 100%");
    root.style.setProperty('--destructive', "0 84.2% 60.2%");
    root.style.setProperty('--destructive-foreground', "0 0% 100%");
    root.style.setProperty('--border', theme.secondary);
    root.style.setProperty('--input', theme.secondary);
    root.style.setProperty('--ring', theme.primary);

    // Set dark mode class based on theme background
    if (theme.background === "0 0% 100%") {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }

    toast({
      title: "Theme applied!",
      description: "The selected theme has been applied to the application.",
    });
  };

  return {
    applyTheme,
  };
}