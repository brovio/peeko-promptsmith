import { memo, useEffect, useRef, useState } from 'react';
import { LoginPreview } from "./LoginPreview";
import { ModelCardPreview } from "./ModelCardPreview";
import { UseCasePreview } from "./UseCasePreview";
import { FormPreview } from "./FormPreview";
import { BaseColorPreview } from "./BaseColorPreview";
import { useThemeManager } from "@/hooks/use-theme-manager";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PreviewType = 'all' | 'base' | 'buttons' | 'cards' | 'inputs' | 'dropdowns' | 'search' | 'icons' | 'dividers';

interface ThemePreviewProps {
  showAllExamples?: boolean;
  previewType?: PreviewType;
}

export const ThemePreview = memo(function ThemePreview({ 
  showAllExamples = false, 
  previewType = 'base' 
}: ThemePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useThemeManager();
  const [selectedPreview, setSelectedPreview] = useState<PreviewType>(previewType);

  useEffect(() => {
    setSelectedPreview(previewType);
  }, [previewType]);

  const renderPreview = () => {
    if (!currentTheme) return null;

    switch (selectedPreview) {
      case 'all':
        return <FormPreview showAllExamples={true} />;
      case 'base':
        return (
          <BaseColorPreview 
            background={currentTheme.background}
            foreground={currentTheme.foreground}
            inputText={currentTheme.input_text || currentTheme.foreground}
          />
        );
      case 'buttons':
        return <FormPreview showButtons={true} />;
      case 'cards':
        return (
          <div className="grid gap-4">
            <ModelCardPreview />
            <UseCasePreview />
          </div>
        );
      case 'inputs':
        return <FormPreview showInputs={true} />;
      case 'dropdowns':
        return <FormPreview showDropdowns={true} />;
      case 'search':
        return <FormPreview showSearch={true} />;
      case 'icons':
        return <FormPreview showIcons={true} />;
      case 'dividers':
        return <FormPreview showDividers={true} />;
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="space-y-8 p-6 border rounded-lg bg-background">
      <Tabs defaultValue={selectedPreview} onValueChange={(value) => setSelectedPreview(value as PreviewType)}>
        <TabsList className="w-full justify-start border-b overflow-x-auto">
          <TabsTrigger value="all">All Examples</TabsTrigger>
          <TabsTrigger value="base">Base Colors</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="inputs">Input Fields</TabsTrigger>
          <TabsTrigger value="dropdowns">Dropdowns</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="icons">Icons</TabsTrigger>
          <TabsTrigger value="dividers">Dividers</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPreview} className="mt-6">
          {renderPreview()}
        </TabsContent>
      </Tabs>
    </div>
  );
});