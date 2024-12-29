import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getTemplateForCategory } from "./CategorySelector";
import { LoadingModal } from "./LoadingModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PromptInputProps {
  selectedCategory: string;
  selectedEnhancer: string;
  onSubmit: (enhancedPrompt: string) => void;
}

export function PromptInput({ selectedCategory, selectedEnhancer, onSubmit }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentModel, setCurrentModel] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsEnhancing(true);
    setAttemptCount(1);
    
    try {
      // First, get the use case description
      const { data: useCase, error: useCaseError } = await supabase
        .from('use_cases')
        .select('description')
        .eq('id', selectedCategory)
        .single();

      if (useCaseError) throw useCaseError;

      // Combine the description with the user's prompt
      const combinedPrompt = `${useCase.description}\n\nUser prompt: ${prompt.trim()}`;
      
      // Get the template and replace the prompt placeholder
      const template = getTemplateForCategory(selectedCategory, selectedEnhancer);
      const enhancedPrompt = template.replace("{prompt}", combinedPrompt);
      
      const { data, error } = await supabase.functions.invoke('generate', {
        body: { prompt: enhancedPrompt }
      });

      if (error) throw error;
      
      setCurrentModel(data.model || "Unknown model");
      onSubmit(data.generatedText);
      
      toast({
        title: "Success",
        description: `Enhanced using ${data.model}`,
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
      setAttemptCount(0);
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
        disabled={!prompt.trim() || isEnhancing}
        className="w-full"
      >
        {isEnhancing ? "Enhancing..." : "Enhance & Submit"}
      </Button>
      
      <LoadingModal 
        open={isEnhancing}
        currentModel={currentModel}
        attemptCount={attemptCount}
      />
    </div>
  );
}