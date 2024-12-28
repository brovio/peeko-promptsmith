import { useToast } from "@/hooks/use-toast";

export function useThemeManager() {
  const { toast } = useToast();

  const applyTheme = (theme: 'light' | 'dark' | 'black') => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark', 'black');
    
    // Add the new theme class
    root.classList.add(theme);
    
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