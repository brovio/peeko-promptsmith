import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ThemePreview } from "./ThemePreview";
import { useToast } from "@/hooks/use-toast";

export function ThemePreviewWrapper() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();
  const rafIdRef = useRef<number>();
  const observerRef = useRef<ResizeObserver | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const { toast } = useToast();

  // Throttled resize handler
  const handleResize = useCallback(() => {
    if (!isMountedRef.current) return;

    // Cancel any existing timeout
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Cancel any existing animation frame
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Set resizing state
    setIsResizing(true);

    // Schedule the resize completion
    resizeTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setIsResizing(false);
      }
    }, 150);
  }, []);

  useEffect(() => {
    const currentPreviewRef = previewRef.current;
    if (!currentPreviewRef) return;

    let timeoutId: NodeJS.Timeout;

    try {
      // Create ResizeObserver with throttling
      observerRef.current = new ResizeObserver((entries) => {
        // Use requestAnimationFrame to throttle updates
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = requestAnimationFrame(() => {
          if (isMountedRef.current) {
            handleResize();
          }
        });
      });

      // Start observing with a delay to prevent initial flicker
      timeoutId = setTimeout(() => {
        if (isMountedRef.current && observerRef.current && currentPreviewRef) {
          observerRef.current.observe(currentPreviewRef);
        }
      }, 100);

    } catch (error) {
      console.error('Error setting up ResizeObserver:', error);
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      // Clear all timeouts
      clearTimeout(timeoutId);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Cancel any pending animation frame
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Disconnect and cleanup observer
      if (observerRef.current) {
        try {
          observerRef.current.disconnect();
          observerRef.current = null;
        } catch (error) {
          console.error('Failed to disconnect observer:', error);
        }
      }

      // Reset state
      setIsResizing(false);
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