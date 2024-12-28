import { useToast } from "@/hooks/use-toast";

export type Theme = 'light' | 'dark' | 'black';

export function useThemeManager() {
  const { toast } = useToast();

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark', 'black');
    
    // Add the new theme class
    root.classList.add(theme);
    
    // Save theme preference
    localStorage.setItem('theme', theme);

    // Show toast notification
    toast({
      title: "Theme updated",
      description: `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme has been applied.`,
    });
  };

  return {
    applyTheme,
  };
}