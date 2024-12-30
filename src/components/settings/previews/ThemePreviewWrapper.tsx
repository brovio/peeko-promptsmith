import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ThemePreview } from "./ThemePreview";
import { useToast } from "@/hooks/use-toast";

export function ThemePreviewWrapper() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const observerRef = useRef<ResizeObserver | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const { toast } = useToast();

  // Debounced resize handler with error handling
  const handleResize = useCallback(() => {
    if (!isMountedRef.current) return;

    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    setIsResizing(true);

    resizeTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsResizing(false);
      }
    }, 100); // Reduced from 150ms to 100ms for better responsiveness
  }, []);

  useEffect(() => {
    const currentPreviewRef = previewRef.current;
    if (!currentPreviewRef) return;

    try {
      observerRef.current = new ResizeObserver((entries) => {
        // Skip processing if component is unmounted
        if (!isMountedRef.current) return;

        // Process only the last entry to avoid unnecessary updates
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          handleResize();
        }
      });

      // Start observing with error handling
      observerRef.current.observe(currentPreviewRef);
    } catch (error) {
      console.error('Error setting up ResizeObserver:', error);
      // Fallback to a basic display without resize observation
      setIsResizing(false);
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      if (observerRef.current) {
        try {
          observerRef.current.disconnect();
        } catch (error) {
          console.error('Error disconnecting observer:', error);
        }
        observerRef.current = null;
      }
    };
  }, [handleResize]);

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