import { ThemePreview } from "../previews/ThemePreview";

interface ThemePreviewSectionProps {
  showPreview: boolean;
  activeTab: string;
}

export function ThemePreviewSection({ 
  showPreview, 
  activeTab 
}: ThemePreviewSectionProps) {
  if (!showPreview) return null;

  return (
    <div className="space-y-4">
      <ThemePreview 
        showAllExamples={activeTab === "all"} 
        previewType={activeTab as any}
      />
    </div>
  );
}