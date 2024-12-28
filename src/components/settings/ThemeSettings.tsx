import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ColorTheme, generateColorTheme } from "@/lib/colorUtils";
import { ThemeCard } from "./ThemeCard";
import { CreateThemeDialog } from "./CreateThemeDialog";

// Predefined themes with HSL values matching our CSS variables
const lightTheme: ColorTheme = {
  background: "220 33% 98%",
  foreground: "220 10% 15%",
  primary: "221 83% 53%",
  secondary: "220 14% 96%",
  accent: "221 83% 53%"
};

const darkTheme: ColorTheme = {
  background: "220 10% 15%",
  foreground: "220 33% 98%",
  primary: "221 83% 53%",
  secondary: "220 14% 24%",
  accent: "221 83% 53%"
};

export function ThemeSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(generateColorTheme());
  const { toast } = useToast();

  const { data: themes, refetch: refetchThemes } = useQuery({
    queryKey: ['themes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    }
  });

  const handleGenerateNewTheme = () => {
    setCurrentTheme(generateColorTheme());
  };

  const handleSaveTheme = async (themeName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('themes')
        .insert({
          name: themeName,
          background_color: currentTheme.background,
          foreground_color: currentTheme.foreground,
          primary_color: currentTheme.primary,
          secondary_color: currentTheme.secondary,
          accent_color: currentTheme.accent,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Theme saved!",
        description: `Your theme "${themeName}" has been saved successfully.`,
      });
      setIsOpen(false);
      refetchThemes();
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error",
        description: "Failed to save theme",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTheme = async (themeId: string) => {
    try {
      const { error } = await supabase
        .from('themes')
        .delete()
        .eq('id', themeId);

      if (error) throw error;

      toast({
        title: "Theme deleted",
        description: "Theme has been removed successfully.",
      });
      refetchThemes();
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast({
        title: "Error",
        description: "Failed to delete theme",
        variant: "destructive",
      });
    }
  };

  const applyTheme = (theme: ColorTheme) => {
    // Apply theme to CSS variables at the root level
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
    root.style.setProperty('--primary-foreground', "210 40% 98%");
    root.style.setProperty('--secondary-foreground', theme.foreground);
    root.style.setProperty('--muted', theme.secondary);
    root.style.setProperty('--muted-foreground', "220 8% 45%");
    root.style.setProperty('--accent-foreground', "210 40% 98%");
    root.style.setProperty('--destructive', "0 84.2% 60.2%");
    root.style.setProperty('--destructive-foreground', "210 40% 98%");
    root.style.setProperty('--border', "220 13% 91%");
    root.style.setProperty('--input', "220 13% 91%");
    root.style.setProperty('--ring', theme.primary);

    toast({
      title: "Theme applied!",
      description: "The selected theme has been applied to the application.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Themes</h2>
        <div className="flex gap-2">
          <Button onClick={() => applyTheme(lightTheme)}>Light Theme</Button>
          <Button onClick={() => applyTheme(darkTheme)} variant="secondary">Dark Theme</Button>
          <Button onClick={() => setIsOpen(true)}>Create New Theme</Button>
        </div>
      </div>

      <CreateThemeDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        currentTheme={currentTheme}
        onGenerateNew={handleGenerateNewTheme}
        onSave={handleSaveTheme}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes?.map((theme) => (
          <ThemeCard
            key={theme.id}
            id={theme.id}
            name={theme.name}
            colors={{
              background: theme.background_color,
              foreground: theme.foreground_color,
              primary: theme.primary_color,
              secondary: theme.secondary_color,
              accent: theme.accent_color,
            }}
            onDelete={handleDeleteTheme}
            onApply={() => applyTheme({
              background: theme.background_color,
              foreground: theme.foreground_color,
              primary: theme.primary_color,
              secondary: theme.secondary_color,
              accent: theme.accent_color,
            })}
          />
        ))}
      </div>
    </div>
  );
}