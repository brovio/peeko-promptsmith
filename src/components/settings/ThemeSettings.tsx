import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ColorTheme, generateColorTheme } from "@/lib/colorUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ThemeSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [themeName, setThemeName] = useState("");
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

  const handleSaveTheme = async () => {
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
      setThemeName("");
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Themes</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Create New Theme</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Theme</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Theme Name</Label>
                <Input
                  placeholder="Enter theme name"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                />
              </div>
              <div 
                className="p-4 rounded"
                style={{ backgroundColor: currentTheme.background }}
              >
                <div className="space-y-2">
                  <div 
                    className="p-2 rounded"
                    style={{ 
                      backgroundColor: currentTheme.primary,
                      color: currentTheme.foreground 
                    }}
                  >
                    Primary Color
                  </div>
                  <div 
                    className="p-2 rounded"
                    style={{ 
                      backgroundColor: currentTheme.secondary,
                      color: currentTheme.foreground 
                    }}
                  >
                    Secondary Color
                  </div>
                  <div 
                    className="p-2 rounded"
                    style={{ 
                      backgroundColor: currentTheme.accent,
                      color: currentTheme.foreground 
                    }}
                  >
                    Accent Color
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleGenerateNewTheme} variant="outline">
                  Generate New Colors
                </Button>
                <Button
                  onClick={handleSaveTheme}
                  disabled={!themeName.trim()}
                >
                  Save Theme
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes?.map((theme) => (
          <Card key={theme.id}>
            <CardHeader>
              <CardTitle>{theme.name}</CardTitle>
              <CardDescription>Custom Theme</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="p-4 rounded space-y-2"
                style={{ backgroundColor: theme.background_color }}
              >
                <div 
                  className="p-2 rounded"
                  style={{ 
                    backgroundColor: theme.primary_color,
                    color: theme.foreground_color 
                  }}
                >
                  Primary Color
                </div>
                <div 
                  className="p-2 rounded"
                  style={{ 
                    backgroundColor: theme.secondary_color,
                    color: theme.foreground_color 
                  }}
                >
                  Secondary Color
                </div>
                <div 
                  className="p-2 rounded"
                  style={{ 
                    backgroundColor: theme.accent_color,
                    color: theme.foreground_color 
                  }}
                >
                  Accent Color
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteTheme(theme.id)}
                >
                  Delete Theme
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}