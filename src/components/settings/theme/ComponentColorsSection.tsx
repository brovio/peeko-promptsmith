import { ColorPickerGroup } from "../ColorPickerGroup";

interface ComponentColorsSectionProps {
  selectedTheme: any;
  handleColorChange: (key: string, value: string) => void;
  type: 'cards' | 'inputs' | 'dropdowns' | 'search' | 'icons' | 'dividers';
}

export function ComponentColorsSection({ selectedTheme, handleColorChange, type }: ComponentColorsSectionProps) {
  const getColorConfig = () => {
    switch (type) {
      case 'cards':
        return {
          label: "Cards",
          description: "Colors for card components",
          mainColor: selectedTheme.card,
          foregroundColor: selectedTheme.card_foreground,
          onMainColorChange: (value: string) => handleColorChange('card', value),
          onForegroundColorChange: (value: string) => handleColorChange('card_foreground', value),
          previewClassName: "bg-card text-card-foreground",
          tooltipContent: "Controls the appearance of card elements throughout the application"
        };
      case 'inputs':
        return {
          label: "Input Fields",
          description: "Colors for input fields and text",
          mainColor: selectedTheme.input,
          foregroundColor: selectedTheme.input_text,
          onMainColorChange: (value: string) => handleColorChange('input', value),
          onForegroundColorChange: (value: string) => handleColorChange('input_text', value),
          previewClassName: "bg-background",
          tooltipContent: "Controls the appearance of input fields, including background and text colors"
        };
      case 'dropdowns':
        return {
          label: "Dropdowns",
          description: "Colors for dropdown menus",
          mainColor: selectedTheme.dropdown_bg,
          foregroundColor: selectedTheme.dropdown_text,
          onMainColorChange: (value: string) => handleColorChange('dropdown_bg', value),
          onForegroundColorChange: (value: string) => handleColorChange('dropdown_text', value),
          previewClassName: "bg-dropdown-bg text-dropdown-text",
          tooltipContent: "Defines the colors for dropdown menus and their text"
        };
      case 'search':
        return {
          label: "Search & Filter",
          description: "Colors for search and filter bars",
          mainColor: selectedTheme.search_bg,
          foregroundColor: selectedTheme.search_text,
          onMainColorChange: (value: string) => handleColorChange('search_bg', value),
          onForegroundColorChange: (value: string) => handleColorChange('search_text', value),
          previewClassName: "bg-search-bg text-search-text",
          tooltipContent: "Controls the appearance of search bars and filter components"
        };
      case 'icons':
        return {
          label: "Icons",
          description: "Colors for icons throughout the application",
          mainColor: selectedTheme.icon,
          foregroundColor: selectedTheme.foreground,
          onMainColorChange: (value: string) => handleColorChange('icon', value),
          onForegroundColorChange: (value: string) => handleColorChange('foreground', value),
          tooltipContent: "Sets the colors for icons throughout the application"
        };
      case 'dividers':
        return {
          label: "Dividers",
          description: "Colors for dividing lines",
          mainColor: selectedTheme.divider,
          foregroundColor: selectedTheme.border,
          onMainColorChange: (value: string) => handleColorChange('divider', value),
          onForegroundColorChange: (value: string) => handleColorChange('border', value),
          tooltipContent: "Controls the appearance of dividing lines between sections"
        };
      default:
        return null;
    }
  };

  const config = getColorConfig();
  if (!config) return null;

  return (
    <div className="space-y-4">
      <ColorPickerGroup {...config} />
    </div>
  );
}