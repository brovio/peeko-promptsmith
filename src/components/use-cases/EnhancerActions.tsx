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
import { supabase } from "@/integrations/supabase/client";
import { LoadingModal } from "@/components/LoadingModal";

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

  const trackOperation = async (operationType: string, originalText: string, modifiedText: string, tokensUsed: number, cost: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('use_case_operations')
        .insert({
          use_case_id: useCaseId,
          user_id: user.id,
          operation_type: operationType,
          original_text: originalText,
          modified_text: modifiedText,
          tokens_used: tokensUsed,
          cost: cost,
          words_changed: Math.abs(modifiedText.split(/\s+/).length - originalText.split(/\s+/).length)
        });

      if (error) {
        console.error(`Error tracking ${operationType} operation:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`Error tracking ${operationType} operation:`, error);
      throw error;
    }
  };

  const handleRemix = async () => {
    if (!currentEnhancer.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to remix",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setAttemptCount(0);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate', {
        body: {
          model: "google/gemini-2.0-flash-thinking-exp:free",
          prompt: `As a creative prompt engineer, analyze and remix this prompt enhancer to generate new ideas and improvements while maintaining its core purpose. Consider different approaches and add innovative elements:

Original enhancer:
${currentEnhancer}

Provide a remixed version that:
1. Maintains the original intent
2. Adds creative new perspectives
3. Improves clarity and effectiveness
4. Suggests alternative approaches

Return ONLY the remixed enhancer text, nothing else.`,
        },
      });

      if (error) throw error;
      
      const newEnhancer = data.generatedText.trim();
      onEnhancerUpdate(newEnhancer);
      
      await trackOperation('remix', currentEnhancer, newEnhancer, data.usage?.total_tokens || 0, data.usage?.total_cost || 0);
      
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
    if (!currentEnhancer.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to enhance",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setAttemptCount(0);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate', {
        body: {
          model: "google/gemini-2.0-flash-thinking-exp:free",
          prompt: `As an expert prompt engineer, enhance this prompt enhancer to improve its quality, clarity, and effectiveness:

Original enhancer:
${currentEnhancer}

Improve the enhancer by:
1. Making it more precise and clear
2. Optimizing its structure and flow
3. Adding any missing important elements
4. Ensuring it follows best practices

Return ONLY the enhanced version, nothing else.`,
        },
      });

      if (error) throw error;
      
      const newEnhancer = data.generatedText.trim();
      onEnhancerUpdate(newEnhancer);
      
      await trackOperation('enhance', currentEnhancer, newEnhancer, data.usage?.total_tokens || 0, data.usage?.total_cost || 0);
      
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