import { useState } from "react";
import { ColorTheme, generateColorTheme } from "@/lib/colorUtils";
import { useToast } from "@/hooks/use-toast";

interface ThemeManagerProps {
  onThemeChange: (theme: ColorTheme) => void;
}

export function ThemeManager({ onThemeChange }: ThemeManagerProps) {
  const [isThemeLocked, setIsThemeLocked] = useState(false);
  const { toast } = useToast();

  const generateNewTheme = () => {
    if (!isThemeLocked) {
      const newTheme = generateColorTheme();
      onThemeChange(newTheme);
      
      toast({
        title: "Theme Updated",
        description: "A new color theme has been generated.",
      });
    }
  };

  const lockCurrentTheme = () => {
    setIsThemeLocked(true);
    toast({
      title: "Theme Locked! 🎨",
      description: "This color combination has been saved as your preference."
    });
  };

  return { generateNewTheme, lockCurrentTheme, isThemeLocked };
}