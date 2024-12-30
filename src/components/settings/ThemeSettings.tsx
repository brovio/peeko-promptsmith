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
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
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
    document.documentElement.style.setProperty('--background', theme.background);
    document.documentElement.style.setProperty('--foreground', theme.foreground);
    document.documentElement.style.setProperty('--card', theme.card);
    document.documentElement.style.setProperty('--card-foreground', theme.card_foreground);
    document.documentElement.style.setProperty('--popover', theme.popover);
    document.documentElement.style.setProperty('--popover-foreground', theme.popover_foreground);
    document.documentElement.style.setProperty('--primary', theme.primary_color);
    document.documentElement.style.setProperty('--primary-foreground', theme.primary_foreground);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.documentElement.style.setProperty('--secondary-foreground', theme.secondary_foreground);
    document.documentElement.style.setProperty('--muted', theme.muted);
    document.documentElement.style.setProperty('--muted-foreground', theme.muted_foreground);
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--accent-foreground', theme.accent_foreground);
    document.documentElement.style.setProperty('--destructive', theme.destructive);
    document.documentElement.style.setProperty('--destructive-foreground', theme.destructive_foreground);
    document.documentElement.style.setProperty('--border', theme.border);
    document.documentElement.style.setProperty('--input', theme.input);
    document.documentElement.style.setProperty('--ring', theme.ring);
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
                  onMainColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    background: value
                  })}
                  onForegroundColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    foreground: value
                  })}
                />

                <ColorPickerGroup
                  label="Card"
                  description="Colors for card components"
                  mainColor={selectedTheme.card}
                  foregroundColor={selectedTheme.card_foreground}
                  onMainColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    card: value
                  })}
                  onForegroundColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    card_foreground: value
                  })}
                  previewClassName="bg-card text-card-foreground"
                />
              </TabsContent>

              <TabsContent value="components" className="space-y-4 mt-4">
                <ColorPickerGroup
                  label="Primary"
                  description="Main action colors"
                  mainColor={selectedTheme.primary_color}
                  foregroundColor={selectedTheme.primary_foreground}
                  onMainColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    primary_color: value
                  })}
                  onForegroundColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    primary_foreground: value
                  })}
                  previewClassName="bg-primary text-primary-foreground"
                />

                <ColorPickerGroup
                  label="Secondary"
                  description="Secondary action colors"
                  mainColor={selectedTheme.secondary}
                  foregroundColor={selectedTheme.secondary_foreground}
                  onMainColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    secondary: value
                  })}
                  onForegroundColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    secondary_foreground: value
                  })}
                  previewClassName="bg-secondary text-secondary-foreground"
                />

                <ColorPickerGroup
                  label="Accent"
                  description="Accent colors for highlights"
                  mainColor={selectedTheme.accent}
                  foregroundColor={selectedTheme.accent_foreground}
                  onMainColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    accent: value
                  })}
                  onForegroundColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    accent_foreground: value
                  })}
                  previewClassName="bg-accent text-accent-foreground"
                />
              </TabsContent>

              <TabsContent value="states" className="space-y-4 mt-4">
                <ColorPickerGroup
                  label="Muted"
                  description="Colors for muted elements"
                  mainColor={selectedTheme.muted}
                  foregroundColor={selectedTheme.muted_foreground}
                  onMainColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    muted: value
                  })}
                  onForegroundColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    muted_foreground: value
                  })}
                  previewClassName="bg-muted text-muted-foreground"
                />

                <ColorPickerGroup
                  label="Destructive"
                  description="Colors for destructive actions"
                  mainColor={selectedTheme.destructive}
                  foregroundColor={selectedTheme.destructive_foreground}
                  onMainColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    destructive: value
                  })}
                  onForegroundColorChange={(value) => setSelectedTheme({
                    ...selectedTheme,
                    destructive_foreground: value
                  })}
                  previewClassName="bg-destructive text-destructive-foreground"
                />
              </TabsContent>
            </Tabs>
          )}

          {!isSuperAdmin && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <p>Only super admins can modify themes.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Live Preview</h3>
          <ThemePreview />
        </div>
      </div>
    </div>
  );
}