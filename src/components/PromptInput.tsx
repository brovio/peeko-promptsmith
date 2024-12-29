import { useState, useEffect } from "react";
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
  const [submissionDetails, setSubmissionDetails] = useState<{
    modelUsed: string;
    enhancerUsed: string;
    fullPrompt: string;
  } | null>(null);
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
    
    setIsEnhancing(true);
    setAttemptCount(1);
    
    try {
      console.log('Starting prompt enhancement process...');
      console.log('Original prompt:', prompt.trim());
      console.log('Using enhancer:', selectedEnhancer || 'No enhancer selected');
      
      // Send just the user's prompt to be enhanced
      const { data, error } = await supabase.functions.invoke('generate', {
        body: { 
          prompt: prompt.trim(),
          model: currentModel
        }
      });

      if (error) throw error;
      
      const modelName = data.model || "Unknown model";
      console.log('Using model:', modelName);
      console.log('Generated text:', data.generatedText);
      
      // Update submission details
      const details = {
        modelUsed: modelName,
        enhancerUsed: selectedEnhancer || 'No enhancer',
        fullPrompt: `${selectedEnhancer} ${prompt.trim()}`
      };
      setSubmissionDetails(details);
      
      // Add detailed log entry
      console.log(`Submission details:
        Model Used: ${details.modelUsed}
        Enhancer Used: ${details.enhancerUsed}
        Full Prompt: ${details.fullPrompt}`);
      
      setCurrentModel(modelName);
      onSubmit(data.generatedText);
      
      toast({
        title: "Success",
        description: `Enhanced using ${modelName}`,
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
      
      {submissionDetails && (
        <div className="mt-4 p-4 border rounded-md bg-muted/50 space-y-2 text-sm">
          <div><strong>Model Used:</strong> {submissionDetails.modelUsed}</div>
          <div><strong>Enhancer Used:</strong> {submissionDetails.enhancerUsed}</div>
          <div><strong>Full prompt submitted:</strong> {submissionDetails.fullPrompt}</div>
        </div>
      )}
      
      <LoadingModal 
        open={isEnhancing}
        currentModel={currentModel}
        attemptCount={attemptCount}
      />
    </div>
  );
}