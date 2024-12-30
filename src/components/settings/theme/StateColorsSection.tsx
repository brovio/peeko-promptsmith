import { ColorPickerGroup } from "../ColorPickerGroup";

interface StateColorsSectionProps {
  selectedTheme: any;
  handleColorChange: (key: string, value: string) => void;
}

export function StateColorsSection({ selectedTheme, handleColorChange }: StateColorsSectionProps) {
  return (
    <div className="space-y-4">
      <ColorPickerGroup
        label="Primary"
        description="Main action colors"
        mainColor={selectedTheme.primary_color}
        foregroundColor={selectedTheme.primary_foreground}
        onMainColorChange={(value) => handleColorChange('primary_color', value)}
        onForegroundColorChange={(value) => handleColorChange('primary_foreground', value)}
        previewClassName="bg-primary text-primary-foreground"
        tooltipContent="Used for primary buttons, links, and key interactive elements"
      />

      <ColorPickerGroup
        label="Secondary"
        description="Secondary action colors"
        mainColor={selectedTheme.secondary}
        foregroundColor={selectedTheme.secondary_foreground}
        onMainColorChange={(value) => handleColorChange('secondary', value)}
        onForegroundColorChange={(value) => handleColorChange('secondary_foreground', value)}
        previewClassName="bg-secondary text-secondary-foreground"
        tooltipContent="Used for secondary buttons and less prominent interactive elements"
      />

      <ColorPickerGroup
        label="Accent"
        description="Accent colors for highlights"
        mainColor={selectedTheme.accent}
        foregroundColor={selectedTheme.accent_foreground}
        onMainColorChange={(value) => handleColorChange('accent', value)}
        onForegroundColorChange={(value) => handleColorChange('accent_foreground', value)}
        previewClassName="bg-accent text-accent-foreground"
        tooltipContent="Used for highlighting important elements and providing visual emphasis"
      />
    </div>
  );
}