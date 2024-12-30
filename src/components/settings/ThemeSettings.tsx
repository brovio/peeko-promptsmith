import { useState, useEffect } from "react";
import { useThemeManager } from "@/hooks/use-theme-manager";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ThemeConfiguration } from "@/types/theme";
import { ThemeSelector } from "./theme/ThemeSelector";
import { ThemePreviewWrapper } from "./previews/ThemePreviewWrapper";
import { ThemeEditorTabs } from "./theme/ThemeEditorTabs";

export function ThemeSettings() {
  const { applyTheme } = useThemeManager();
  const { toast } = useToast();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [themes, setThemes] = useState<ThemeConfiguration[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    checkSuperAdmin();
    fetchThemes();
  }, []);

  const checkSuperAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_superadmin')
      .eq('id', session.user.id)
      .single();

    setIsSuperAdmin(profile?.is_superadmin || false);
  };

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThemes(data as ThemeConfiguration[]);
    } catch (error: any) {
      console.error('Error fetching themes:', error);
      toast({
        title: "Error fetching themes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = async (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    setSelectedTheme(theme);
    applyTheme(theme);
  };

  const handleSaveTheme = async () => {
    if (!selectedTheme) return;

    try {
      const { error } = await supabase
        .from('theme_configurations')
        .update(selectedTheme)
        .eq('id', selectedTheme.id);

      if (error) throw error;

      toast({
        title: "Theme saved",
        description: "Your theme changes have been saved successfully.",
      });

      fetchThemes();
    } catch (error: any) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error saving theme",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleColorChange = (key: keyof ThemeConfiguration, value: string) => {
    if (!selectedTheme) return;
    
    const updatedTheme = {
      ...selectedTheme,
      [key]: value
    };
    
    setSelectedTheme(updatedTheme);
    applyTheme(updatedTheme);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Theme Settings</h2>
        <p className="text-muted-foreground mb-6">
          Customize the appearance of your application.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-4">
          <ThemeSelector
            themes={themes}
            selectedTheme={selectedTheme}
            onThemeChange={handleThemeChange}
            onSaveChanges={handleSaveTheme}
            isSuperAdmin={isSuperAdmin}
            onEditModeChange={setIsEditMode}
          />

          {selectedTheme && (
            <ThemeEditorTabs
              selectedTheme={selectedTheme}
              handleColorChange={handleColorChange}
              showPreview={isEditMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}
