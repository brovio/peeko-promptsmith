import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ThemeConfiguration } from "@/types/theme";

interface ThemeSelectorProps {
  themes: ThemeConfiguration[];
  selectedTheme: ThemeConfiguration | null;
  onThemeChange: (themeId: string) => void;
  onSaveChanges: () => void;
  isSuperAdmin: boolean;
  onEditModeChange: (isEditMode: boolean) => void;
}

export function ThemeSelector({ 
  themes, 
  selectedTheme, 
  onThemeChange, 
  onSaveChanges,
  isSuperAdmin,
  onEditModeChange
}: ThemeSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
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

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="edit-mode"
              onCheckedChange={onEditModeChange}
            />
            <Label htmlFor="edit-mode">Show Preview</Label>
          </div>

          {isSuperAdmin && selectedTheme && (
            <Button onClick={onSaveChanges}>
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}