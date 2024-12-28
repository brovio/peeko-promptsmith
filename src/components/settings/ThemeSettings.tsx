import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColorTheme, generateColorTheme } from "@/lib/colorUtils";
import { ThemeCard } from "./ThemeCard";
import { CreateThemeDialog } from "./CreateThemeDialog";
import { ThemeActions } from "./ThemeActions";
import { useThemeManager } from "@/hooks/use-theme-manager";

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
  const { applyTheme, handleDeleteTheme, handleSaveTheme } = useThemeManager();

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

  const onSaveTheme = async (themeName: string) => {
    const success = await handleSaveTheme(themeName, currentTheme);
    if (success) {
      setIsOpen(false);
      refetchThemes();
    }
  };

  const onDeleteTheme = async (themeId: string) => {
    const success = await handleDeleteTheme(themeId);
    if (success) {
      refetchThemes();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Themes</h2>
        <ThemeActions
          onApplyLightTheme={() => applyTheme(lightTheme)}
          onApplyDarkTheme={() => applyTheme(darkTheme)}
          onCreateTheme={() => setIsOpen(true)}
        />
      </div>

      <CreateThemeDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        currentTheme={currentTheme}
        onGenerateNew={handleGenerateNewTheme}
        onSave={onSaveTheme}
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
            onDelete={onDeleteTheme}
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