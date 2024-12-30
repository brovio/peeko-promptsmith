import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPickerGroup } from "../ColorPickerGroup";
import { ThemeConfiguration } from "@/types/theme";

interface ThemeEditorTabsProps {
  selectedTheme: ThemeConfiguration;
  handleColorChange: (key: string, value: string) => void;
}

export function ThemeEditorTabs({ selectedTheme, handleColorChange }: ThemeEditorTabsProps) {
  return (
    <Tabs defaultValue="base" className="w-full">
      <TabsList className="w-full justify-start border-b">
        <TabsTrigger value="base">Base Colors</TabsTrigger>
        <TabsTrigger value="buttons">Buttons</TabsTrigger>
        <TabsTrigger value="cards">Cards</TabsTrigger>
        <TabsTrigger value="inputs">Input Fields</TabsTrigger>
        <TabsTrigger value="dropdowns">Dropdowns</TabsTrigger>
        <TabsTrigger value="search">Search</TabsTrigger>
        <TabsTrigger value="icons">Icons</TabsTrigger>
        <TabsTrigger value="dividers">Dividers</TabsTrigger>
      </TabsList>

      <TabsContent value="base" className="space-y-4 mt-4">
        <ColorPickerGroup
          label="Background & Text"
          description="Main background and text colors"
          mainColor={selectedTheme.background}
          foregroundColor={selectedTheme.foreground}
          onMainColorChange={(value) => handleColorChange('background', value)}
          onForegroundColorChange={(value) => handleColorChange('foreground', value)}
          tooltipContent="Controls the main background and text colors"
        />
      </TabsContent>

      <TabsContent value="buttons" className="space-y-4 mt-4">
        <ColorPickerGroup
          label="Primary Button"
          description="Primary button colors"
          mainColor={selectedTheme.primary_color}
          foregroundColor={selectedTheme.primary_foreground}
          onMainColorChange={(value) => handleColorChange('primary_color', value)}
          onForegroundColorChange={(value) => handleColorChange('primary_foreground', value)}
          tooltipContent="Used for primary buttons and key interactive elements"
        />
        <ColorPickerGroup
          label="Secondary Button"
          description="Secondary button colors"
          mainColor={selectedTheme.secondary}
          foregroundColor={selectedTheme.secondary_foreground}
          onMainColorChange={(value) => handleColorChange('secondary', value)}
          onForegroundColorChange={(value) => handleColorChange('secondary_foreground', value)}
          tooltipContent="Used for secondary buttons"
        />
      </TabsContent>

      <TabsContent value="cards" className="space-y-4 mt-4">
        <ColorPickerGroup
          label="Card"
          description="Card component colors"
          mainColor={selectedTheme.card}
          foregroundColor={selectedTheme.card_foreground}
          onMainColorChange={(value) => handleColorChange('card', value)}
          onForegroundColorChange={(value) => handleColorChange('card_foreground', value)}
          tooltipContent="Defines the appearance of card elements"
        />
      </TabsContent>

      <TabsContent value="inputs" className="space-y-4 mt-4">
        <ColorPickerGroup
          label="Input Fields"
          description="Colors for input fields"
          mainColor={selectedTheme.input}
          foregroundColor={selectedTheme.input_text}
          onMainColorChange={(value) => handleColorChange('input', value)}
          onForegroundColorChange={(value) => handleColorChange('input_text', value)}
          tooltipContent="Controls input field appearance"
        />
      </TabsContent>

      <TabsContent value="dropdowns" className="space-y-4 mt-4">
        <ColorPickerGroup
          label="Dropdown Menus"
          description="Colors for dropdown components"
          mainColor={selectedTheme.dropdown_bg}
          foregroundColor={selectedTheme.dropdown_text}
          onMainColorChange={(value) => handleColorChange('dropdown_bg', value)}
          onForegroundColorChange={(value) => handleColorChange('dropdown_text', value)}
          tooltipContent="Controls dropdown menu appearance"
        />
      </TabsContent>

      <TabsContent value="search" className="space-y-4 mt-4">
        <ColorPickerGroup
          label="Search Components"
          description="Colors for search bars"
          mainColor={selectedTheme.search_bg}
          foregroundColor={selectedTheme.search_text}
          onMainColorChange={(value) => handleColorChange('search_bg', value)}
          onForegroundColorChange={(value) => handleColorChange('search_text', value)}
          tooltipContent="Controls search bar appearance"
        />
      </TabsContent>

      <TabsContent value="icons" className="space-y-4 mt-4">
        <ColorPickerGroup
          label="Icons"
          description="Colors for icons"
          mainColor={selectedTheme.icon}
          foregroundColor={selectedTheme.foreground}
          onMainColorChange={(value) => handleColorChange('icon', value)}
          onForegroundColorChange={(value) => handleColorChange('foreground', value)}
          tooltipContent="Controls icon colors"
        />
      </TabsContent>

      <TabsContent value="dividers" className="space-y-4 mt-4">
        <ColorPickerGroup
          label="Dividers"
          description="Colors for dividing lines"
          mainColor={selectedTheme.divider}
          foregroundColor={selectedTheme.foreground}
          onMainColorChange={(value) => handleColorChange('divider', value)}
          onForegroundColorChange={(value) => handleColorChange('foreground', value)}
          tooltipContent="Controls divider line colors"
        />
      </TabsContent>
    </Tabs>
  );
}