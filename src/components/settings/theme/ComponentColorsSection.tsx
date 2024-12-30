import { ColorPickerGroup } from "../ColorPickerGroup";

type PreviewType = "all" | "base" | "buttons" | "cards" | "inputs" | "dropdowns" | "search" | "icons" | "dividers";

interface ComponentColorsSectionProps {
  selectedTheme: any;
  handleColorChange: (key: string, value: string) => void;
  type: PreviewType;
}

export function ComponentColorsSection({ selectedTheme, handleColorChange, type }: ComponentColorsSectionProps) {
  return (
    <div className="space-y-4">
      {type === "all" && (
        <>
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
        </>
      )}

      {type === "cards" && (
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
      )}

      {type === "inputs" && (
        <ColorPickerGroup
          label="Input"
          description="Colors for input fields"
          mainColor={selectedTheme.input}
          foregroundColor={selectedTheme.input_text}
          onMainColorChange={(value) => handleColorChange('input', value)}
          onForegroundColorChange={(value) => handleColorChange('input_text', value)}
          previewClassName="bg-input text-input-foreground"
          tooltipContent="Defines the appearance of input fields"
        />
      )}

      {type === "dropdowns" && (
        <ColorPickerGroup
          label="Dropdown"
          description="Colors for dropdowns"
          mainColor={selectedTheme.dropdown_bg}
          foregroundColor={selectedTheme.dropdown_text}
          onMainColorChange={(value) => handleColorChange('dropdown_bg', value)}
          onForegroundColorChange={(value) => handleColorChange('dropdown_text', value)}
          previewClassName="bg-dropdown text-dropdown-foreground"
          tooltipContent="Defines the appearance of dropdown menus"
        />
      )}

      {type === "search" && (
        <ColorPickerGroup
          label="Search"
          description="Colors for search fields"
          mainColor={selectedTheme.search_bg}
          foregroundColor={selectedTheme.search_text}
          onMainColorChange={(value) => handleColorChange('search_bg', value)}
          onForegroundColorChange={(value) => handleColorChange('search_text', value)}
          previewClassName="bg-search text-search-foreground"
          tooltipContent="Defines the appearance of search fields"
        />
      )}

      {type === "icons" && (
        <ColorPickerGroup
          label="Icons"
          description="Colors for icons"
          mainColor={selectedTheme.icon}
          foregroundColor={selectedTheme.icon}
          onMainColorChange={(value) => handleColorChange('icon', value)}
          onForegroundColorChange={(value) => handleColorChange('icon', value)}
          previewClassName="bg-icon text-icon-foreground"
          tooltipContent="Defines the appearance of icons"
        />
      )}

      {type === "dividers" && (
        <ColorPickerGroup
          label="Dividers"
          description="Colors for dividers"
          mainColor={selectedTheme.divider}
          foregroundColor={selectedTheme.divider}
          onMainColorChange={(value) => handleColorChange('divider', value)}
          onForegroundColorChange={(value) => handleColorChange('divider', value)}
          previewClassName="bg-divider text-divider-foreground"
          tooltipContent="Defines the appearance of dividers"
        />
      )}
    </div>
  );
}