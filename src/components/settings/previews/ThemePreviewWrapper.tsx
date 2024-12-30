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

  // Debounced resize handler with RAF
  const handleResize = useCallback(() => {
    if (!isMountedRef.current) return;

    // Clear any existing animation frames
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Clear any existing timeouts
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Use RAF for smooth handling
    rafRef.current = requestAnimationFrame(() => {
      if (!isMountedRef.current) return;
      
      setIsResizing(true);

      // Debounce the resize completion
      resizeTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setIsResizing(false);
        }
      }, 150); // Reduced debounce time
    });
  }, []);

  useEffect(() => {
    const currentPreviewRef = previewRef.current;
    
    // Early return if no ref
    if (!currentPreviewRef) return;

    try {
      // Clean up any existing observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer with error handling
      observerRef.current = new ResizeObserver((entries) => {
        // Skip if component is unmounted
        if (!isMountedRef.current) return;
        
        // Process only if we have entries
        if (entries.length > 0) {
          handleResize();
        }
      });

      // Start observing
      observerRef.current.observe(currentPreviewRef);

      // Cleanup function
      return () => {
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