import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemePreview } from "./ThemePreview";

export function ThemePreviewWrapper() {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Theme Preview</h3>
        <Button 
          variant="outline" 
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? "Hide Examples" : "Show All Examples"}
        </Button>
      </div>
      <ThemePreview showAllExamples={isEditMode} />
    </div>
  );
}