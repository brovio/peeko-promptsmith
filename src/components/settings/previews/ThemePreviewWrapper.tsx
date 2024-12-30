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

  // Debounced resize handler with RAF for smoother performance
  const handleResize = useCallback(() => {
    if (!isMountedRef.current) return;

    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    requestAnimationFrame(() => {
      if (!isMountedRef.current) return;
      setIsResizing(true);

      resizeTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setIsResizing(false);
        }
      }, 150); // Increased debounce time for better performance
    });
  }, []);

  useEffect(() => {
    const currentPreviewRef = previewRef.current;
    if (!currentPreviewRef) return;

    try {
      // Cleanup any existing observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer with error handling
      observerRef.current = new ResizeObserver((entries) => {
        if (!isMountedRef.current) return;
        
        const lastEntry = entries[entries.length - 1];
        if (lastEntry && lastEntry.contentRect) {
          handleResize();
        }
      });

      // Start observing with a slight delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current && observerRef.current && currentPreviewRef) {
          observerRef.current.observe(currentPreviewRef);
        }
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        isMountedRef.current = false;
        
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }

        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error setting up ResizeObserver:', error);
      setIsResizing(false);
    }
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