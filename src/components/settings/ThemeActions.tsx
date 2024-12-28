import { Button } from "@/components/ui/button";
import { ColorTheme } from "@/lib/colorUtils";

interface ThemeActionsProps {
  onApplyLightTheme: () => void;
  onApplyDarkTheme: () => void;
  onCreateTheme: () => void;
}

export function ThemeActions({ 
  onApplyLightTheme, 
  onApplyDarkTheme, 
  onCreateTheme 
}: ThemeActionsProps) {
  return (
    <div className="flex gap-2">
      <Button onClick={onApplyLightTheme}>Light Theme</Button>
      <Button onClick={onApplyDarkTheme} variant="secondary">Dark Theme</Button>
      <Button onClick={onCreateTheme}>Create New Theme</Button>
    </div>
  );
}