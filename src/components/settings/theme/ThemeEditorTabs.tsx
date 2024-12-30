import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseColorsSection } from "./BaseColorsSection";
import { StateColorsSection } from "./StateColorsSection";
import { ComponentColorsSection } from "./ComponentColorsSection";
import { ThemeConfiguration } from "@/types/theme";
import { ThemePreview } from "../previews/ThemePreview";

interface ThemeEditorTabsProps {
  selectedTheme: ThemeConfiguration;
  handleColorChange: (key: string, value: string) => void;
  showPreview: boolean;
}

export function ThemeEditorTabs({ selectedTheme, handleColorChange, showPreview }: ThemeEditorTabsProps) {
  return (
    <Tabs defaultValue="base" className="w-full">
      <TabsList className="w-full justify-start border-b overflow-x-auto">
        <TabsTrigger value="all">All Elements</TabsTrigger>
        <TabsTrigger value="base">Base Colors</TabsTrigger>
        <TabsTrigger value="buttons">Buttons</TabsTrigger>
        <TabsTrigger value="cards">Cards</TabsTrigger>
        <TabsTrigger value="inputs">Input Fields</TabsTrigger>
        <TabsTrigger value="dropdowns">Dropdowns</TabsTrigger>
        <TabsTrigger value="search">Search</TabsTrigger>
        <TabsTrigger value="icons">Icons</TabsTrigger>
        <TabsTrigger value="dividers">Dividers</TabsTrigger>
      </TabsList>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <div className="space-y-4">
          <TabsContent value="all">
            <BaseColorsSection 
              selectedTheme={selectedTheme} 
              handleColorChange={handleColorChange}
            />
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
          <TabsContent value="cards">
            <ComponentColorsSection 
              selectedTheme={selectedTheme} 
              handleColorChange={handleColorChange}
              type="cards"
            />
          </TabsContent>
          <TabsContent value="inputs">
            <ComponentColorsSection 
              selectedTheme={selectedTheme} 
              handleColorChange={handleColorChange}
              type="inputs"
            />
          </TabsContent>
          <TabsContent value="dropdowns">
            <ComponentColorsSection 
              selectedTheme={selectedTheme} 
              handleColorChange={handleColorChange}
              type="dropdowns"
            />
          </TabsContent>
          <TabsContent value="search">
            <ComponentColorsSection 
              selectedTheme={selectedTheme} 
              handleColorChange={handleColorChange}
              type="search"
            />
          </TabsContent>
          <TabsContent value="icons">
            <ComponentColorsSection 
              selectedTheme={selectedTheme} 
              handleColorChange={handleColorChange}
              type="icons"
            />
          </TabsContent>
          <TabsContent value="dividers">
            <ComponentColorsSection 
              selectedTheme={selectedTheme} 
              handleColorChange={handleColorChange}
              type="dividers"
            />
          </TabsContent>
        </div>

        {showPreview && (
          <div className="space-y-4">
            <ThemePreview showAllExamples={false} previewType="all" />
          </div>
        )}
      </div>
    </Tabs>
  );
}