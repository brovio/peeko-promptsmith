import { memo, useEffect, useRef } from 'react';
import { LoginPreview } from "./LoginPreview";
import { ModelCardPreview } from "./ModelCardPreview";
import { UseCasePreview } from "./UseCasePreview";
import { FormPreview } from "./FormPreview";

interface ThemePreviewProps {
  showAllExamples?: boolean;
  previewType?: 'base' | 'buttons' | 'cards' | 'inputs' | 'dropdowns' | 'search' | 'icons' | 'dividers';
}

export const ThemePreview = memo(function ThemePreview({ 
  showAllExamples = false, 
  previewType = 'base' 
}: ThemePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force a reflow when the component mounts or updates
    if (containerRef.current) {
      containerRef.current.style.display = 'none';
      void containerRef.current.offsetHeight; // Trigger reflow
      containerRef.current.style.display = '';
    }
  }, [showAllExamples, previewType]);

  const renderPreview = () => {
    // If showAllExamples is true and we're on the base tab, show everything
    if (showAllExamples && previewType === 'base') {
      return (
        <div className="space-y-8">
          <FormPreview showAllExamples={true} />
          <LoginPreview />
          <div className="max-w-md">
            <ModelCardPreview />
            <UseCasePreview />
          </div>
        </div>
      );
    }

    // Otherwise, show only the relevant preview for each tab
    switch (previewType) {
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
            <div className="max-w-md space-y-4">
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
        return <FormPreview showAllExamples={false} />;
    }
  };

  return (
    <div ref={containerRef} className="space-y-8 p-6 border rounded-lg bg-background">
      {renderPreview()}
    </div>
  );
});
