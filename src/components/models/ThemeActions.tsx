import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";
import { ColorTheme } from "@/lib/colorUtils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ThemeActionsProps {
  currentTheme: ColorTheme;
  isThemeLocked: boolean;
  onGenerateNewTheme: () => void;
  onLockTheme: () => void;
}

export function ThemeActions({
  currentTheme,
  isThemeLocked,
  onGenerateNewTheme,
  onLockTheme,
}: ThemeActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [themeName, setThemeName] = useState("");
  const { toast } = useToast();

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
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error",
        description: "Failed to save theme",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onGenerateNewTheme}
        disabled={isThemeLocked}
        className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
      >
        <Palette className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onLockTheme}
        disabled={isThemeLocked}
        className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
      >
        <Check className="h-4 w-4" />
      </Button>
      {isThemeLocked && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              Save as Theme
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Current Theme</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter theme name"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSaveTheme}
                disabled={!themeName.trim()}
                className="w-full"
              >
                Save Theme
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}