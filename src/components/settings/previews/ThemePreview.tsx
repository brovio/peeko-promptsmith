import { memo, useEffect, useRef, useState } from 'react';
import { LoginPreview } from "./LoginPreview";
import { ModelCardPreview } from "./ModelCardPreview";
import { UseCasePreview } from "./UseCasePreview";
import { FormPreview } from "./FormPreview";
import { BaseColorPreview } from "./BaseColorPreview";
import { useThemeManager } from "@/hooks/use-theme-manager";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PreviewType = 'base' | 'buttons' | 'cards' | 'inputs' | 'dropdowns' | 'search' | 'icons' | 'dividers';

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

  if (showAllExamples) {
    return (
      <div ref={containerRef} className="space-y-8 p-6 border rounded-lg bg-background">
        <FormPreview showAllExamples={true} />
      </div>
    );
  }

  const renderPreview = () => {
    if (!currentTheme) return null;

    // Return only the selected preview component
    switch (selectedPreview) {
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold capitalize">
            {selectedPreview === 'base' ? 'Base Colors' : `${selectedPreview} Examples`}
          </h3>
          <Select value={selectedPreview} onValueChange={(value: PreviewType) => setSelectedPreview(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select preview" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="base">Base Colors</SelectItem>
              <SelectItem value="buttons">Buttons</SelectItem>
              <SelectItem value="cards">Cards</SelectItem>
              <SelectItem value="inputs">Input Fields</SelectItem>
              <SelectItem value="dropdowns">Dropdowns</SelectItem>
              <SelectItem value="search">Search</SelectItem>
              <SelectItem value="icons">Icons</SelectItem>
              <SelectItem value="dividers">Dividers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {renderPreview()}
      </div>
    </div>
  );
});