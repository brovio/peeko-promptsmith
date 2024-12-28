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

interface EnhancerActionsProps {
  currentEnhancer: string;
  onEnhancerUpdate: (newEnhancer: string) => void;
}

export function EnhancerActions({ currentEnhancer, onEnhancerUpdate }: EnhancerActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      if (!response.ok) throw new Error("Failed to remix enhancer");
      
      const data = await response.json();
      onEnhancerUpdate(data.generatedText.trim());
      
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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      });

      if (!response.ok) throw new Error("Failed to enhance prompt");
      
      const data = await response.json();
      onEnhancerUpdate(data.generatedText.trim());
      
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
    <div className="absolute right-2 top-2 flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemix}
              disabled={isProcessing}
              className="h-8 w-8 text-white hover:bg-white/10"
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
              className="h-8 w-8 text-white hover:bg-white/10"
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