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

  // Improved resize handler with debouncing
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
    }, 150);
  }, []);

  useEffect(() => {
    const currentPreviewRef = previewRef.current;
    if (!currentPreviewRef) return;

    try {
      // Create ResizeObserver with error handling
      observerRef.current = new ResizeObserver((entries) => {
        // Cancel any pending animation frame
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }

        // Schedule a new update with RAF for smoother handling
        rafIdRef.current = requestAnimationFrame(() => {
          if (isMountedRef.current) {
            handleResize();
          }
        });
      });

      // Start observing with a slight delay
      const timeoutId = setTimeout(() => {
        if (isMountedRef.current && observerRef.current) {
          observerRef.current.observe(currentPreviewRef);
        }
      }, 100);

      return () => {
        isMountedRef.current = false;

        // Clear all timeouts and animation frames
        clearTimeout(timeoutId);
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }

        // Disconnect observer
        if (observerRef.current) {
          try {
            observerRef.current.disconnect();
          } catch (error) {
            console.error('Failed to disconnect observer:', error);
          }
        }
      };
    } catch (error) {
      console.error('Error setting up ResizeObserver:', error);
      return () => {
        isMountedRef.current = false;
      };
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