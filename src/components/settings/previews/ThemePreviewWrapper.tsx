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

  // Debounced resize handler with error handling and RAF
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
      }, 50);
    });
  }, []);

  useEffect(() => {
    const currentPreviewRef = previewRef.current;
    if (!currentPreviewRef) return;

    let isObserving = false;

    const setupObserver = () => {
      try {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }

        observerRef.current = new ResizeObserver((entries) => {
          if (!isMountedRef.current || !isObserving) return;
          
          // Only process size changes above a threshold
          const lastEntry = entries[entries.length - 1];
          if (lastEntry && lastEntry.contentRect) {
            handleResize();
          }
        });

        // Start observing with a slight delay
        setTimeout(() => {
          if (isMountedRef.current && observerRef.current && currentPreviewRef) {
            observerRef.current.observe(currentPreviewRef);
            isObserving = true;
          }
        }, 100);

      } catch (error) {
        console.error('Error setting up ResizeObserver:', error);
        setIsResizing(false);
      }
    };

    setupObserver();

    return () => {
      isMountedRef.current = false;
      isObserving = false;
      
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