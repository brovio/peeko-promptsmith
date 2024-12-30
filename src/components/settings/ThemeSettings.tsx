import { useState, useEffect } from "react";
import { useThemeManager } from "@/hooks/use-theme-manager";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPickerGroup } from "./ColorPickerGroup";
import { ThemePreview } from "./previews/ThemePreview";

interface ThemeConfiguration {
  id: string;
  name: string;
  theme_type: 'light' | 'dark' | 'black' | 'custom';
  background: string;
  foreground: string;
  card: string;
  card_foreground: string;
  popover: string;
  popover_foreground: string;
  primary_color: string;
  primary_foreground: string;
  secondary: string;
  secondary_foreground: string;
  muted: string;
  muted_foreground: string;
  accent: string;
  accent_foreground: string;
  destructive: string;
  destructive_foreground: string;
  border: string;
  input: string;
  ring: string;
  is_active: boolean;
}

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
    const { data: themes, error } = await supabase
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

    setThemes(themes || []);
    setIsLoading(false);
  };

  const handleThemeChange = async (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;
    
    setSelectedTheme(theme);
    
    // Apply theme changes immediately
    Object.entries(theme).forEach(([key, value]) => {
      if (typeof value === 'string' && key !== 'id' && key !== 'name' && key !== 'theme_type') {
        document.documentElement.style.setProperty(`--${key.replace(/_/g, '-')}`, value);
      }
    });
  };

  const handleSaveTheme = async () => {
    if (!selectedTheme) return;

    const { error } = await supabase
      .from('theme_configurations')
      .update(selectedTheme)
      .eq('id', selectedTheme.id);

    if (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error saving theme",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Theme saved",
      description: "Your theme changes have been saved successfully.",
    });

    fetchThemes();
  };

  const handleColorChange = (key: keyof ThemeConfiguration, value: string) => {
    if (!selectedTheme) return;
    
    const updatedTheme = {
      ...selectedTheme,
      [key]: value
    };
    
    setSelectedTheme(updatedTheme);
    
    // Apply change immediately
    document.documentElement.style.setProperty(`--${key.replace(/_/g, '-')}`, value);
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
                <ColorPickerGroup
                  label="Background & Text"
                  description="Main background and text colors"
                  mainColor={selectedTheme.background}
                  foregroundColor={selectedTheme.foreground}
                  inputTextColor={selectedTheme.input}
                  onMainColorChange={(value) => handleColorChange('background', value)}
                  onForegroundColorChange={(value) => handleColorChange('foreground', value)}
                  onInputTextColorChange={(value) => handleColorChange('input', value)}
                  tooltipContent="Controls the main background color, text color, and input field text colors throughout the application. These colors affect the overall look and readability of your content."
                />

                <ColorPickerGroup
                  label="Card"
                  description="Colors for card components"
                  mainColor={selectedTheme.card}
                  foregroundColor={selectedTheme.card_foreground}
                  onMainColorChange={(value) => handleColorChange('card', value)}
                  onForegroundColorChange={(value) => handleColorChange('card_foreground', value)}
                  previewClassName="bg-card text-card-foreground"
                  tooltipContent="Defines the appearance of card elements, which are used to group related content. This includes backgrounds and text colors for cards throughout the interface."
                />
              </TabsContent>

              <TabsContent value="components" className="space-y-4 mt-4">
                <ColorPickerGroup
                  label="Primary"
                  description="Main action colors"
                  mainColor={selectedTheme.primary_color}
                  foregroundColor={selectedTheme.primary_foreground}
                  onMainColorChange={(value) => handleColorChange('primary_color', value)}
                  onForegroundColorChange={(value) => handleColorChange('primary_foreground', value)}
                  previewClassName="bg-primary text-primary-foreground"
                  tooltipContent="Used for primary buttons, links, and key interactive elements. These colors should stand out and guide users to important actions."
                />

                <ColorPickerGroup
                  label="Secondary"
                  description="Secondary action colors"
                  mainColor={selectedTheme.secondary}
                  foregroundColor={selectedTheme.secondary_foreground}
                  onMainColorChange={(value) => handleColorChange('secondary', value)}
                  onForegroundColorChange={(value) => handleColorChange('secondary_foreground', value)}
                  previewClassName="bg-secondary text-secondary-foreground"
                  tooltipContent="Used for secondary buttons and less prominent interactive elements. These colors should complement the primary colors while being visually distinct."
                />
              </TabsContent>

              <TabsContent value="states" className="space-y-4 mt-4">
                <ColorPickerGroup
                  label="Accent"
                  description="Accent colors for highlights"
                  mainColor={selectedTheme.accent}
                  foregroundColor={selectedTheme.accent_foreground}
                  onMainColorChange={(value) => handleColorChange('accent', value)}
                  onForegroundColorChange={(value) => handleColorChange('accent_foreground', value)}
                  previewClassName="bg-accent text-accent-foreground"
                  tooltipContent="Used for highlighting important elements and providing visual emphasis. These colors help draw attention to specific parts of the interface."
                />

                <ColorPickerGroup
                  label="Destructive"
                  description="Colors for destructive actions"
                  mainColor={selectedTheme.destructive}
                  foregroundColor={selectedTheme.destructive_foreground}
                  onMainColorChange={(value) => handleColorChange('destructive', value)}
                  onForegroundColorChange={(value) => handleColorChange('destructive_foreground', value)}
                  previewClassName="bg-destructive text-destructive-foreground"
                  tooltipContent="Used for warning messages and destructive actions like delete buttons. These colors should clearly indicate potential danger or irreversible actions."
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
