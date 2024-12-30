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

  // Debounced resize handler with RAF and error boundary
  const handleResize = useCallback(() => {
    if (!isMountedRef.current) return;

    // Clear any existing timeouts
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Clear any existing animation frames
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Use RAF to smooth out rapid resize events
    rafRef.current = requestAnimationFrame(() => {
      setIsResizing(true);

      // Debounce the resize completion
      resizeTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setIsResizing(false);
        }
      }, 250); // Increased debounce time to reduce notifications
    });
  }, []);

  useEffect(() => {
    const currentPreviewRef = previewRef.current;
    if (!currentPreviewRef) return;

    try {
      // Clean up any existing observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer with error handling and throttling
      observerRef.current = new ResizeObserver((entries) => {
        // Ignore notifications if component is unmounted
        if (!isMountedRef.current) return;
        
        // Only process the last entry to reduce notifications
        const lastEntry = entries[entries.length - 1];
        if (lastEntry?.contentRect) {
          handleResize();
        }
      });

      // Start observing with a delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current && observerRef.current && currentPreviewRef) {
          observerRef.current.observe(currentPreviewRef);
        }
      }, 100);

      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
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