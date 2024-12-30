import { memo, useEffect, useRef } from 'react';
import { LoginPreview } from "./LoginPreview";
import { ModelCardPreview } from "./ModelCardPreview";
import { UseCasePreview } from "./UseCasePreview";
import { FormPreview } from "./FormPreview";
import { BaseColorPreview } from "./BaseColorPreview";
import { useThemeManager } from "@/hooks/use-theme-manager";

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

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.display = 'none';
      void containerRef.current.offsetHeight;
      containerRef.current.style.display = '';
    }
  }, [showAllExamples, previewType]);

  if (showAllExamples) {
    return (
      <div ref={containerRef} className="space-y-8 p-6 border rounded-lg bg-background">
        <FormPreview showAllExamples={true} />
      </div>
    );
  }

  const renderPreview = () => {
    if (!currentTheme) return null;

    switch (previewType) {
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
        <h3 className="text-lg font-semibold capitalize">
          {previewType === 'base' ? 'Base Colors' : `${previewType} Examples`}
        </h3>
        {renderPreview()}
      </div>
    </div>
  );
});