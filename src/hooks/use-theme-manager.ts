import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
      return true;
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast({
        title: "Error",
        description: "Failed to delete theme",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSaveTheme = async (themeName: string, currentTheme: ColorTheme) => {
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
      return true;
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error",
        description: "Failed to save theme",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    applyTheme,
    handleDeleteTheme,
    handleSaveTheme,
  };
}