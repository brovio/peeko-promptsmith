import { Tabs } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { ThemeConfiguration } from "@/types/theme";
import { ThemeTabsList } from "./ThemeTabsList";
import { ThemeColorSections } from "./ThemeColorSections";
import { ThemePreviewSection } from "./ThemePreviewSection";

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
  const [activeTab, setActiveTab] = useState<PreviewType>("all");

  return (
    <Tabs 
      defaultValue="all" 
      className="w-full"
      onValueChange={(value) => setActiveTab(value as PreviewType)}
    >
      <div className="flex justify-between items-center mb-4">
        <ThemeTabsList />

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <div className="space-y-4">
          <ThemeColorSections
            selectedTheme={selectedTheme}
            handleColorChange={handleColorChange}
            activeTab={activeTab}
          />
        </div>

        <ThemePreviewSection 
          showPreview={showPreview}
          activeTab={activeTab}
        />
      </div>
    </Tabs>
  );
}