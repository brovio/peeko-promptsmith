import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ThemeConfiguration } from "@/types/theme";

interface ThemeSelectorProps {
  themes: ThemeConfiguration[];
  selectedTheme: ThemeConfiguration | null;
  onThemeChange: (themeId: string) => void;
  onSaveChanges: () => void;
  isSuperAdmin: boolean;
}

export function ThemeSelector({ 
  themes, 
  selectedTheme, 
  onThemeChange, 
  onSaveChanges,
  isSuperAdmin 
}: ThemeSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <Select
        value={selectedTheme?.id}
        onValueChange={onThemeChange}
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
        <Button onClick={onSaveChanges}>
          Save Changes
        </Button>
      )}
    </div>
  );
}