import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ColorTheme, generateColorTheme } from "@/lib/colorUtils";
import { ThemeCard } from "./ThemeCard";
import { CreateThemeDialog } from "./CreateThemeDialog";

// Predefined themes
const lightTheme: ColorTheme = {
  background: "#FFFFFF",
  foreground: "#000000",
  primary: "#F1F1F1",
  secondary: "#F8F8F8",
  accent: "#F2FCE2"
};

const darkTheme: ColorTheme = {
  background: "#221F26",
  foreground: "#FFFFFF",
  primary: "#333333",
  secondary: "#2A2A2A",
  accent: "#C8C8C9"
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
    // Apply theme to CSS variables
    document.documentElement.style.setProperty('--background', theme.background);
    document.documentElement.style.setProperty('--foreground', theme.foreground);
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--accent', theme.accent);

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