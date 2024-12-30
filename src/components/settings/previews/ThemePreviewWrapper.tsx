import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ThemePreview } from "./ThemePreview";
import { useToast } from "@/hooks/use-toast";

export function ThemePreviewWrapper() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const { toast } = useToast();

  const debouncedResize = useCallback(() => {
    if (isResizing) return;
    setIsResizing(true);
    
    setTimeout(() => {
      setIsResizing(false);
    }, 100);
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('resize', debouncedResize);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [debouncedResize]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Theme Preview</h3>
        <Button 
          variant="outline" 
          onClick={() => {
            setIsEditMode(!isEditMode);
            if (!isEditMode) {
              toast({
                title: "Preview Mode Enabled",
                description: "Showing all theme examples",
              });
            }
          }}
        >
          {isEditMode ? "Hide Examples" : "Show All Examples"}
        </Button>
      </div>
      {!isResizing && (
        <ThemePreview showAllExamples={isEditMode} />
      )}
    </div>
  );
}