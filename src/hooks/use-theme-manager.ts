import { useToast } from "@/hooks/use-toast";

export function useThemeManager() {
  const { toast } = useToast();

  const applyTheme = (theme: 'light' | 'dark' | 'black') => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark', 'black');
    
    // Add the new theme class
    root.classList.add(theme);

    if (theme === 'black') {
      root.style.setProperty('--background', '0 0% 0%');
      root.style.setProperty('--foreground', '0 0% 100%');
      root.style.setProperty('--primary', '142 76% 36%');
      root.style.setProperty('--secondary', '0 0% 10%');
      root.style.setProperty('--accent', '142 76% 36%');
      root.style.setProperty('--card', '0 0% 0%');
      root.style.setProperty('--card-foreground', '0 0% 100%');
      root.style.setProperty('--popover', '0 0% 0%');
      root.style.setProperty('--popover-foreground', '0 0% 100%');
      root.style.setProperty('--muted', '0 0% 10%');
      root.style.setProperty('--muted-foreground', '0 0% 70%');
      root.style.setProperty('--border', '0 0% 20%');
      root.style.setProperty('--input', '0 0% 20%');
    } else {
      // Reset to default theme variables from theme.css
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--card');
      root.style.removeProperty('--card-foreground');
      root.style.removeProperty('--popover');
      root.style.removeProperty('--popover-foreground');
      root.style.removeProperty('--muted');
      root.style.removeProperty('--muted-foreground');
      root.style.removeProperty('--border');
      root.style.removeProperty('--input');
    }

    // Save theme preference
    localStorage.setItem('theme', theme);

    toast({
      title: "Theme updated",
      description: `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme has been applied.`,
    });
  };

  return {
    applyTheme,
  };
}