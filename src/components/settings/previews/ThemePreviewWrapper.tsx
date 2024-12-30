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

  // Improved resize handler with rate limiting
  const debouncedResize = useCallback(() => {
    if (!isMountedRef.current) return;

    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    setIsResizing(true);
    resizeTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsResizing(false);
      }
    }, 150);
  }, []);

  useEffect(() => {
    const currentPreviewRef = previewRef.current;
    if (!currentPreviewRef) return;

    let rafId: number;
    let isObserving = false;

    // Create ResizeObserver with batched updates
    const observer = new ResizeObserver((entries) => {
      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Schedule a new update
      rafId = requestAnimationFrame(() => {
        if (isMountedRef.current && isObserving) {
          debouncedResize();
        }
      });
    });

    // Delay observation start
    startObservingTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        try {
          observer.observe(currentPreviewRef);
          isObserving = true;
          resizeObserverRef.current = observer;
        } catch (error) {
          console.error('Failed to start observing:', error);
        }
      }
    }, 100);

    // Enhanced cleanup
    return () => {
      isMountedRef.current = false;
      isObserving = false;

      // Cancel any pending animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Clear timeouts
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (startObservingTimeoutRef.current) {
        clearTimeout(startObservingTimeoutRef.current);
      }

      // Cleanup observer
      if (observer) {
        try {
          observer.disconnect();
        } catch (error) {
          console.error('Failed to disconnect observer:', error);
        }
      }

      // Reset state
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