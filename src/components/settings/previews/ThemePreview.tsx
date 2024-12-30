import { memo, useEffect, useRef } from 'react';
import { LoginPreview } from "./LoginPreview";
import { ModelCardPreview } from "./ModelCardPreview";
import { UseCasePreview } from "./UseCasePreview";
import { FormPreview } from "./FormPreview";
import { BaseColorPreview } from "./BaseColorPreview";
import { useThemeManager } from "@/hooks/use-theme-manager";

interface ThemePreviewProps {
  showAllExamples?: boolean;
  previewType?: 'base' | 'buttons' | 'cards' | 'inputs' | 'dropdowns' | 'search' | 'icons' | 'dividers';
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Base Color Examples</h3>
            <BaseColorPreview 
              background={currentTheme.background}
              foreground={currentTheme.foreground}
              inputText={currentTheme.input_text || currentTheme.foreground}
            />
          </div>
        );
      case 'buttons':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Button Examples</h3>
            <FormPreview showButtons={true} />
          </div>
        );
      case 'cards':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Card Examples</h3>
            <div className="grid gap-4">
              <ModelCardPreview />
              <UseCasePreview />
            </div>
          </div>
        );
      case 'inputs':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Input Examples</h3>
            <FormPreview showInputs={true} />
          </div>
        );
      case 'dropdowns':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dropdown Examples</h3>
            <FormPreview showDropdowns={true} />
          </div>
        );
      case 'search':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Search Examples</h3>
            <FormPreview showSearch={true} />
          </div>
        );
      case 'icons':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Icon Examples</h3>
            <FormPreview showIcons={true} />
          </div>
        );
      case 'dividers':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Divider Examples</h3>
            <FormPreview showDividers={true} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="space-y-8 p-6 border rounded-lg bg-background">
      {renderPreview()}
    </div>
  );
});