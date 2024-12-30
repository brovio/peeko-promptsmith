import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseColorsSection } from "./BaseColorsSection";
import { StateColorsSection } from "./StateColorsSection";
import { ComponentColorsSection } from "./ComponentColorsSection";
import { ThemeConfiguration } from "@/types/theme";
import { ThemePreview } from "../previews/ThemePreview";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

type PreviewType = "all" | "base" | "buttons" | "cards" | "inputs" | "dropdowns" | "search" | "icons" | "dividers";

interface ThemeEditorTabsProps {
  selectedTheme: ThemeConfiguration;
  handleColorChange: (key: string, value: string) => void;
  showPreview: boolean;
  onPreviewChange: (show: boolean) => void;
}

export function ThemeEditorTabs({ 
  selectedTheme, 
  handleColorChange, 
  showPreview,
  onPreviewChange 
}: ThemeEditorTabsProps) {
  const [previewFilter, setPreviewFilter] = useState<PreviewType>("all");
  const [activeTab, setActiveTab] = useState<PreviewType>("all");

  return (
    <Tabs 
      defaultValue="all" 
      className="w-full"
      onValueChange={(value) => {
        setActiveTab(value as PreviewType);
        setPreviewFilter(value as PreviewType);
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <TabsList className="flex flex-wrap gap-1 bg-background p-1">
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={showPreview}
              onCheckedChange={onPreviewChange}
              id="preview-mode"
            />
            <label htmlFor="preview-mode" className="text-sm">
              Show Preview
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
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
                type={type as PreviewType}
              />
            </TabsContent>
          ))}
        </div>

        {showPreview && (
          <div className="space-y-4">
            <ThemePreview 
              showAllExamples={activeTab === "all"} 
              previewType={activeTab}
            />
          </div>
        )}
      </div>
    </Tabs>
  );
}