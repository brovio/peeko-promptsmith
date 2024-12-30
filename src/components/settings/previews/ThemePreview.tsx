import { memo, useEffect, useRef, useState } from 'react';
import { LoginPreview } from "./LoginPreview";
import { ModelCardPreview } from "./ModelCardPreview";
import { UseCasePreview } from "./UseCasePreview";
import { FormPreview } from "./FormPreview";
import { BaseColorPreview } from "./BaseColorPreview";
import { useThemeManager } from "@/hooks/use-theme-manager";
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
      <TabsContent value={selectedPreview} className="mt-6">
        {renderPreview()}
      </TabsContent>
    </div>
  );
});