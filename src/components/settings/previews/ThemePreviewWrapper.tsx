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
  const rafRef = useRef<number>();
  const { toast } = useToast();

  // Debounced resize handler with throttling
  const handleResize = useCallback(() => {
    if (!isMountedRef.current) return;

    // Clear existing RAF to prevent stacking
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Clear existing timeout to prevent stacking
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Use RAF to batch resize updates
    rafRef.current = requestAnimationFrame(() => {
      if (!isMountedRef.current) return;
      setIsResizing(true);

      // Add a small delay before allowing new observations
      resizeTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setIsResizing(false);
        }
      }, 100);
    });
  }, []);

  useEffect(() => {
    const currentPreviewRef = previewRef.current;
    
    if (!currentPreviewRef) return;

    try {
      // Cleanup existing observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer with throttling
      observerRef.current = new ResizeObserver((entries) => {
        if (!isMountedRef.current || entries.length === 0) return;
        
        // Use the last entry to avoid processing unnecessary updates
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          handleResize();
        }
      });

      // Start observing with a small delay
      const startObservingTimeout = setTimeout(() => {
        if (observerRef.current && isMountedRef.current) {
          observerRef.current.observe(currentPreviewRef);
        }
      }, 50);

      // Comprehensive cleanup
      return () => {
        clearTimeout(startObservingTimeout);
        isMountedRef.current = false;
        
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }

        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
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