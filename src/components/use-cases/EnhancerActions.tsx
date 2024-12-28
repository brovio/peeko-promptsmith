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

interface EnhancerActionsProps {
  currentEnhancer: string;
  onEnhancerUpdate: (newEnhancer: string) => void;
  useCaseId: string;
}

export function EnhancerActions({ currentEnhancer, onEnhancerUpdate, useCaseId }: EnhancerActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const trackOperation = async (operationType: string, originalText: string, modifiedText: string, tokensUsed: number, cost: number) => {
    const wordsChanged = modifiedText.split(/\s+/).length - originalText.split(/\s+/).length;
    
    try {
      const { error } = await supabase
        .from('use_case_operations')
        .insert({
          use_case_id: useCaseId,
          operation_type: operationType,
          original_text: originalText,
          modified_text: modifiedText,
          tokens_used: tokensUsed,
          cost: cost,
          words_changed: Math.abs(wordsChanged)
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Error tracking ${operationType} operation:`, error);
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
    try {
      const { data, error } = await supabase.functions.invoke('generate', {
        body: {
          model: "gemini/gemini-pro",
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
      
      // Track the operation
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
    try {
      const { data, error } = await supabase.functions.invoke('generate', {
        body: {
          model: "gemini/gemini-pro",
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
      
      // Track the operation
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
    }
  };

  return (
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
  );
}