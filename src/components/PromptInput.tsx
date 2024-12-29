import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingModal } from "./LoadingModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PromptInputProps {
  selectedCategory: string;
  selectedEnhancer: string;
  selectedModel: string;
  onSubmit: (enhancedPrompt: string) => void;
}

export function PromptInput({ 
  selectedCategory, 
  selectedEnhancer, 
  selectedModel,
  onSubmit 
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();

  // Update prompt when selectedEnhancer changes
  useEffect(() => {
    if (selectedEnhancer) {
      setPrompt(selectedEnhancer);
      console.log('Prompt updated with enhancer:', selectedEnhancer);
    }
  }, [selectedEnhancer]);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to enhance",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedModel) {
      toast({
        title: "Error",
        description: "Please select a model first",
        variant: "destructive",
      });
      return;
    }
    
    setIsEnhancing(true);
    
    try {
      console.log('Starting prompt enhancement process...');
      
      // Construct the full prompt
      const fullPrompt = `Please enhance the following prompt:\n\n${prompt.trim()}`;
      console.log('Full prompt:', fullPrompt);
      
      const { data, error } = await supabase.functions.invoke('generate', {
        body: { 
          prompt: fullPrompt,
          model: selectedModel
        }
      });

      if (error) throw error;
      
      console.log('Generated text:', data.generatedText);
      onSubmit(data.generatedText);
      
      toast({
        title: "Success",
        description: `Enhanced using ${selectedModel}`,
      });
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      toast({
        title: "Error",
        description: "Failed to enhance prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your prompt here..."
        className="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        disabled={!prompt.trim() || isEnhancing || !selectedModel}
        className="w-full"
      >
        {isEnhancing ? "Enhancing..." : "Enhance & Submit"}
      </Button>
      
      <LoadingModal 
        open={isEnhancing}
        currentModel={selectedModel}
        attemptCount={1}
      />
    </div>
  );
}