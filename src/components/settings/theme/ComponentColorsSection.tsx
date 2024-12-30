import { ColorPickerGroup } from "../ColorPickerGroup";

interface ComponentColorsSectionProps {
  selectedTheme: any;
  handleColorChange: (key: string, value: string) => void;
}

export function ComponentColorsSection({ selectedTheme, handleColorChange }: ComponentColorsSectionProps) {
  return (
    <div className="space-y-4">
      <ColorPickerGroup
        label="Input Fields"
        description="Colors for input fields and text"
        mainColor={selectedTheme.input}
        foregroundColor={selectedTheme.input_text}
        onMainColorChange={(value) => handleColorChange('input', value)}
        onForegroundColorChange={(value) => handleColorChange('input_text', value)}
        previewClassName="bg-background"
        tooltipContent="Controls the appearance of input fields, including background, border, and text colors"
      />

      <ColorPickerGroup
        label="Dropdowns"
        description="Colors for dropdown menus"
        mainColor={selectedTheme.dropdown_bg}
        foregroundColor={selectedTheme.dropdown_text}
        onMainColorChange={(value) => handleColorChange('dropdown_bg', value)}
        onForegroundColorChange={(value) => handleColorChange('dropdown_text', value)}
        previewClassName="bg-dropdown-bg text-dropdown-text"
        tooltipContent="Defines the colors for dropdown menus and their text"
      />

      <ColorPickerGroup
        label="Search & Filter"
        description="Colors for search and filter bars"
        mainColor={selectedTheme.search_bg}
        foregroundColor={selectedTheme.search_text}
        onMainColorChange={(value) => handleColorChange('search_bg', value)}
        onForegroundColorChange={(value) => handleColorChange('search_text', value)}
        previewClassName="bg-search-bg text-search-text"
        tooltipContent="Controls the appearance of search bars and filter components"
      />

      <ColorPickerGroup
        label="Icons & Dividers"
        description="Colors for icons and dividing lines"
        mainColor={selectedTheme.icon}
        foregroundColor={selectedTheme.divider}
        onMainColorChange={(value) => handleColorChange('icon', value)}
        onForegroundColorChange={(value) => handleColorChange('divider', value)}
        tooltipContent="Sets the colors for icons throughout the application and dividing lines between sections"
      />
    </div>
  );
}