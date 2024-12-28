import { RotateCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoadingModal } from "@/components/LoadingModal";
import { enhanceOperation } from "./utils/enhanceOperation";
import { remixOperation } from "./utils/remixOperation";

interface EnhancerActionsProps {
  currentEnhancer: string;
  onEnhancerUpdate: (newEnhancer: string) => void;
  useCaseId: string;
}

export function EnhancerActions({ currentEnhancer, onEnhancerUpdate, useCaseId }: EnhancerActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentModel, setCurrentModel] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();

  const handleRemix = async () => {
    if (!useCaseId) {
      toast({
        title: "Error",
        description: "Invalid use case ID",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setAttemptCount(1);
    
    try {
      const { newEnhancer, model } = await remixOperation(currentEnhancer, useCaseId);
      onEnhancerUpdate(newEnhancer);
      setCurrentModel(model || "Unknown model");
      
      toast({
        title: "Success",
        description: "Enhancer remixed successfully",
      });
    } catch (error) {
      console.error("Error remixing enhancer:", error);
      toast({
        title: "Error",
        description: "Failed to remix enhancer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setCurrentModel("");
      setAttemptCount(0);
    }
  };

  const handleEnhance = async () => {
    if (!useCaseId) {
      toast({
        title: "Error",
        description: "Invalid use case ID",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setAttemptCount(1);
    
    try {
      const { newEnhancer, model } = await enhanceOperation(currentEnhancer, useCaseId);
      onEnhancerUpdate(newEnhancer);
      setCurrentModel(model || "Unknown model");
      
      toast({
        title: "Success",
        description: "Enhancer improved successfully",
      });
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast({
        title: "Error",
        description: "Failed to enhance prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setCurrentModel("");
      setAttemptCount(0);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemix}
                disabled={isProcessing}
                className="h-8 w-8"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remix enhancer with new ideas</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEnhance}
                disabled={isProcessing}
                className="h-8 w-8"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enhance prompt quality</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <LoadingModal 
        open={isProcessing}
        currentModel={currentModel}
        attemptCount={attemptCount}
        title="Processing Enhancer"
        description={
          currentModel ? 
          `Attempting to use model: ${currentModel} (Attempt ${attemptCount})` :
          "Initializing enhancement process..."
        }
      />
    </>
  );
}