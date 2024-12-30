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
        return [
          {
            label: "Model Cards",
            description: "Colors for model listing cards",
            mainColor: selectedTheme.model_card_bg || selectedTheme.card,
            foregroundColor: selectedTheme.model_card_text || selectedTheme.card_foreground,
            onMainColorChange: (value: string) => handleColorChange('model_card_bg', value),
            onForegroundColorChange: (value: string) => handleColorChange('model_card_text', value),
            previewClassName: "bg-card text-card-foreground",
            tooltipContent: "Controls the appearance of cards in the models listing page"
          },
          {
            label: "Content Cards",
            description: "Colors for content cards",
            mainColor: selectedTheme.content_card_bg || selectedTheme.card,
            foregroundColor: selectedTheme.content_card_text || selectedTheme.card_foreground,
            onMainColorChange: (value: string) => handleColorChange('content_card_bg', value),
            onForegroundColorChange: (value: string) => handleColorChange('content_card_text', value),
            previewClassName: "bg-card text-card-foreground",
            tooltipContent: "Controls the appearance of cards in content pages"
          }
        ];
      case 'dividers':
        return [
          {
            label: "Menu Dividers",
            description: "Colors for menu separators",
            mainColor: selectedTheme.menu_divider || selectedTheme.divider,
            foregroundColor: selectedTheme.border,
            onMainColorChange: (value: string) => handleColorChange('menu_divider', value),
            onForegroundColorChange: (value: string) => handleColorChange('border', value),
            tooltipContent: "Controls the appearance of dividing lines in menus"
          },
          {
            label: "Content Dividers",
            description: "Colors for content separators",
            mainColor: selectedTheme.content_divider || selectedTheme.divider,
            foregroundColor: selectedTheme.border,
            onMainColorChange: (value: string) => handleColorChange('content_divider', value),
            onForegroundColorChange: (value: string) => handleColorChange('border', value),
            tooltipContent: "Controls the appearance of dividing lines in content areas"
          },
          {
            label: "Section Dividers",
            description: "Colors for section separators",
            mainColor: selectedTheme.section_divider || selectedTheme.divider,
            foregroundColor: selectedTheme.border,
            onMainColorChange: (value: string) => handleColorChange('section_divider', value),
            onForegroundColorChange: (value: string) => handleColorChange('border', value),
            tooltipContent: "Controls the appearance of dividing lines between major sections"
          }
        ];
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
    }
  };

  const configs = getColorConfig();
  if (!configs) return null;

  return (
    <div className="space-y-4">
      {Array.isArray(configs) ? (
        configs.map((config, index) => (
          <ColorPickerGroup key={index} {...config} />
        ))
      ) : (
        <ColorPickerGroup {...configs} />
      )}
    </div>
  );
}
