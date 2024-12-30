import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ThemePreview } from "./ThemePreview";
import { useToast } from "@/hooks/use-toast";

export function ThemePreviewWrapper() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const startObservingTimeoutRef = useRef<NodeJS.Timeout>();
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const { toast } = useToast();

  // Enhanced debounced resize handler
  const debouncedResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    if (!isMountedRef.current) return;

    try {
      setIsResizing(true);
      resizeTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setIsResizing(false);
        }
      }, 150);
    } catch (error) {
      console.error('Error in resize handling:', error);
      setIsResizing(false);
    }
  }, []);

  useEffect(() => {
    const currentPreviewRef = previewRef.current;

    // Delay starting the observer
    startObservingTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current || !currentPreviewRef) return;

      try {
        // Create ResizeObserver with error handling
        resizeObserverRef.current = new ResizeObserver((entries) => {
          if (!isMountedRef.current) return;

          // Use requestAnimationFrame to avoid layout thrashing
          window.requestAnimationFrame(() => {
            if (isMountedRef.current && entries.length > 0) {
              debouncedResize();
            }
          });
        });

        // Start observing with error handling
        try {
          resizeObserverRef.current.observe(currentPreviewRef);
        } catch (error) {
          console.error('Error starting ResizeObserver:', error);
        }
      } catch (error) {
        console.error('Error creating ResizeObserver:', error);
      }
    }, 100);

    // Enhanced cleanup function
    return () => {
      isMountedRef.current = false;

      // Clear all timeouts
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (startObservingTimeoutRef.current) {
        clearTimeout(startObservingTimeoutRef.current);
      }

      // Cleanup ResizeObserver
      if (resizeObserverRef.current) {
        try {
          resizeObserverRef.current.disconnect();
          resizeObserverRef.current = null;
        } catch (error) {
          console.error('Error disconnecting ResizeObserver:', error);
        }
      }

      // Reset state if component is unmounting
      setIsResizing(false);
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