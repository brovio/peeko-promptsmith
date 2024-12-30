import { TabsContent } from "@/components/ui/tabs";
import { BaseColorsSection } from "./BaseColorsSection";
import { StateColorsSection } from "./StateColorsSection";
import { ComponentColorsSection } from "./ComponentColorsSection";
import { ThemeConfiguration } from "@/types/theme";

interface ThemeColorSectionsProps {
  selectedTheme: ThemeConfiguration;
  handleColorChange: (key: string, value: string) => void;
  activeTab: string;
}

export function ThemeColorSections({
  selectedTheme,
  handleColorChange,
  activeTab,
}: ThemeColorSectionsProps) {
  return (
    <div className="space-y-4">
      <TabsContent value="all">
        <div className="space-y-8">
          <BaseColorsSection 
            selectedTheme={selectedTheme} 
            handleColorChange={handleColorChange}
          />
          <StateColorsSection 
            selectedTheme={selectedTheme} 
            handleColorChange={handleColorChange}
          />
          <ComponentColorsSection 
            selectedTheme={selectedTheme} 
            handleColorChange={handleColorChange}
            type="all"
          />
        </div>
      </TabsContent>
      <TabsContent value="base">
        <BaseColorsSection 
          selectedTheme={selectedTheme} 
          handleColorChange={handleColorChange}
        />
      </TabsContent>
      <TabsContent value="buttons">
        <StateColorsSection 
          selectedTheme={selectedTheme} 
          handleColorChange={handleColorChange}
        />
      </TabsContent>
      {["cards", "inputs", "dropdowns", "search", "icons", "dividers"].map((type) => (
        <TabsContent key={type} value={type}>
          <ComponentColorsSection 
            selectedTheme={selectedTheme} 
            handleColorChange={handleColorChange}
            type={type as any}
          />
        </TabsContent>
      ))}
    </div>
  );
}