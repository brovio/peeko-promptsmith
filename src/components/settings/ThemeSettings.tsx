import { useState, useEffect } from "react";
import { useThemeManager } from "@/hooks/use-theme-manager";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ThemeConfiguration } from "@/types/theme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemePreview } from "./previews/ThemePreview";
import { BaseColorsSection } from "./theme/BaseColorsSection";
import { ComponentColorsSection } from "./theme/ComponentColorsSection";
import { StateColorsSection } from "./theme/StateColorsSection";

export function ThemeSettings() {
  const { applyTheme } = useThemeManager();
  const { toast } = useToast();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [themes, setThemes] = useState<ThemeConfiguration[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

      if (error) {
        console.error('Error fetching themes:', error);
        toast({
          title: "Error fetching themes",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setThemes(data as ThemeConfiguration[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = async (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    
    setSelectedTheme(theme);
    
    // Apply theme changes immediately
    Object.entries(theme).forEach(([key, value]) => {
      if (typeof value === 'string' && key !== 'id' && key !== 'name' && key !== 'theme_type') {
        const cssVarName = key.replace(/_/g, '-');
        document.documentElement.style.setProperty(`--${cssVarName}`, value);
      }
    });
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
    
    // Apply change immediately
    const cssVarName = key.replace(/_/g, '-');
    document.documentElement.style.setProperty(`--${cssVarName}`, value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Theme Settings</h2>
        <p className="text-muted-foreground mb-6">
          Customize the appearance of your application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Select
              value={selectedTheme?.id}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isSuperAdmin && selectedTheme && (
              <Button onClick={handleSaveTheme}>
                Save Changes
              </Button>
            )}
          </div>

          {selectedTheme && (
            <Tabs defaultValue="base" className="w-full">
              <TabsList>
                <TabsTrigger value="base">Base Colors</TabsTrigger>
                <TabsTrigger value="components">Component Colors</TabsTrigger>
                <TabsTrigger value="states">State Colors</TabsTrigger>
              </TabsList>

              <TabsContent value="base" className="space-y-4 mt-4">
                <BaseColorsSection
                  selectedTheme={selectedTheme}
                  handleColorChange={handleColorChange}
                />
              </TabsContent>

              <TabsContent value="components" className="space-y-4 mt-4">
                <ComponentColorsSection
                  selectedTheme={selectedTheme}
                  handleColorChange={handleColorChange}
                />
              </TabsContent>

              <TabsContent value="states" className="space-y-4 mt-4">
                <StateColorsSection
                  selectedTheme={selectedTheme}
                  handleColorChange={handleColorChange}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="space-y-4">
          <ThemePreview />
        </div>
      </div>
    </div>
  );
}