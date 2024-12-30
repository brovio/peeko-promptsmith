import { useThemeManager } from "@/hooks/use-theme-manager";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface ThemeOption {
  name: string;
  value: 'light' | 'dark' | 'black';
  description: string;
}

const themeOptions: ThemeOption[] = [
  {
    name: 'Light Theme',
    value: 'light',
    description: 'Clean white background with subtle gray accents and green highlights',
  },
  {
    name: 'Dark Theme',
    value: 'dark',
    description: 'Deep navy background with balanced contrast and emerald accents',
  },
  {
    name: 'Black Theme',
    value: 'black',
    description: 'Pure black background with maximum contrast and neon green highlights',
  },
];

export function ThemeSettings() {
  const { applyTheme } = useThemeManager();
  const { toast } = useToast();

  const handleMakeDefault = (theme: 'light' | 'dark' | 'black') => {
    localStorage.setItem('default-theme', theme);
    toast({
      title: "Default Theme Set",
      description: `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme has been set as default`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Theme</h2>
        <p className="text-muted-foreground mb-6">
          Choose your preferred theme appearance. Changes are applied immediately.
        </p>
      </div>

      <div className="space-y-4">
        {themeOptions.map((theme, index) => (
          <div key={theme.value}>
            <div className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <h3 className="font-medium">{theme.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {theme.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyTheme(theme.value)}
                  className="text-xs"
                >
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMakeDefault(theme.value)}
                  className="text-xs"
                >
                  Set Default
                </Button>
              </div>
            </div>
            {index < themeOptions.length - 1 && (
              <Separator className="bg-primary/10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}