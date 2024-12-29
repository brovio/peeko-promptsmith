import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingModal } from "./LoadingModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PromptInputProps {
  selectedCategory: string;
  selectedEnhancer: string;
  selectedModel: string;
  onSubmit: (enhancedPrompt: string, metadata?: any) => void;
}

export function PromptInput({ 
  selectedCategory, 
  selectedEnhancer, 
  selectedModel,
  onSubmit 
}: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [processingDetails, setProcessingDetails] = useState("");
  const { toast } = useToast();
  const [startTime, setStartTime] = useState<Date | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
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
    
    setStartTime(new Date());
    setIsEnhancing(true);
    setProcessingDetails("Preparing prompt for enhancement...");
    
    try {
      console.log('Starting prompt submission process...');
      const combinedPrompt = `${selectedEnhancer} ${prompt.trim()}`;
      console.log('Combined prompt:', combinedPrompt);
      
      setProcessingDetails("Communicating with AI model...");
      const startTime = Date.now();
      
      const { data, error } = await supabase.functions.invoke('generate', {
        body: { 
          prompt: combinedPrompt,
          model: selectedModel
        }
      });

      if (error) throw error;
      
      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000; // Convert to seconds
      
      console.log('Generated text:', data.generatedText);
      
      // Include metadata with the submission
      onSubmit(data.generatedText, {
        processingTime,
        model: selectedModel,
        enhancerText: selectedEnhancer,
        userPrompt: prompt.trim(),
        fullPrompt: combinedPrompt,
        context: "Standard enhancement context",
        inputTokens: data.usage?.prompt_tokens || "N/A",
        outputTokens: data.usage?.completion_tokens || "N/A",
        cost: data.usage?.total_cost || "N/A"
      });
      
      toast({
        title: "Success",
        description: `Processed using ${selectedModel}`,
      });
    } catch (error) {
      console.error('Error processing prompt:', error);
      toast({
        title: "Error",
        description: "Failed to process prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
      setProcessingDetails("");
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
        Enhance
      </Button>
      
      <LoadingModal 
        open={isEnhancing}
        currentModel={selectedModel}
        attemptCount={1}
        title="Enhancing your prompt..."
        description={processingDetails}
      />
    </div>
  );
}