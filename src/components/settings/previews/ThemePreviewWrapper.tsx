import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ThemePreview } from "./ThemePreview";
import { useToast } from "@/hooks/use-toast";

export function ThemePreviewWrapper() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const { toast } = useToast();

  const debouncedResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    if (!isMountedRef.current) return;
    
    setIsResizing(true);
    
    resizeTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsResizing(false);
      }
    }, 150);
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        // Only trigger resize handling if the component is mounted
        if (isMountedRef.current && previewRef.current) {
          debouncedResize();
        }
      });

      resizeObserverRef.current.observe(previewRef.current);
    }
    
    return () => {
      isMountedRef.current = false;
      
      // Cleanup resize observer
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      // Clear any pending timeouts
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
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
      <div ref={previewRef} className="relative min-h-[200px]">
        {!isResizing && (
          <ThemePreview showAllExamples={isEditMode} />
        )}
      </div>
    </div>
  );
}