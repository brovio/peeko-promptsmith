import { ColorPickerGroup } from "../ColorPickerGroup";

interface BaseColorsSectionProps {
  selectedTheme: any;
  handleColorChange: (key: string, value: string) => void;
}

export function BaseColorsSection({ selectedTheme, handleColorChange }: BaseColorsSectionProps) {
  return (
    <div className="space-y-4">
      <ColorPickerGroup
        label="Background & Text"
        description="Main background and text colors"
        mainColor={selectedTheme.background}
        foregroundColor={selectedTheme.foreground}
        inputTextColor={selectedTheme.input_text}
        onMainColorChange={(value) => handleColorChange('background', value)}
        onForegroundColorChange={(value) => handleColorChange('foreground', value)}
        onInputTextColorChange={(value) => handleColorChange('input_text', value)}
        tooltipContent="Controls the main background color, text color, and input field text colors throughout the application"
      />

      <ColorPickerGroup
        label="Card"
        description="Colors for card components"
        mainColor={selectedTheme.card}
        foregroundColor={selectedTheme.card_foreground}
        onMainColorChange={(value) => handleColorChange('card', value)}
        onForegroundColorChange={(value) => handleColorChange('card_foreground', value)}
        previewClassName="bg-card text-card-foreground"
        tooltipContent="Defines the appearance of card elements, which are used to group related content"
      />
    </div>
  );
}