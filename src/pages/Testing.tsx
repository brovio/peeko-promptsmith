import { useState } from "react";
import { ModelSelector } from "@/components/ModelSelector";
import { CategorySelector } from "@/components/CategorySelector";
import { useModelsData } from "@/components/models/useModelsData";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingModal } from "@/components/LoadingModal";

export default function Testing() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEnhancer, setSelectedEnhancer] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentModel, setCurrentModel] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [usedModel, setUsedModel] = useState("");
  const [usedPrompt, setUsedPrompt] = useState("");
  const { toast } = useToast();
  const { models } = useModelsData();

  const handleSubmit = async () => {
    if (!prompt.trim() || !selectedModel) {
      toast({
        title: "Error",
        description: "Please enter a prompt and select a model",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setAttemptCount(1);

    try {
      // Combine the enhancer with the user's prompt if an enhancer is selected
      const finalPrompt = selectedEnhancer 
        ? `${selectedEnhancer}\n${prompt.trim()}`
        : prompt.trim();

      const { data, error } = await supabase.functions.invoke('generate', {
        body: { 
          prompt: finalPrompt,
          model: selectedModel
        }
      });

      if (error) throw error;

      setCurrentModel(data.model || "Unknown model");
      setResult(data.generatedText);
      
      // Set the used model and prompt
      setUsedModel(data.model || "Unknown model");
      setUsedPrompt(finalPrompt);

      toast({
        title: "Success",
        description: `Generated using ${data.model}`,
      });
    } catch (error) {
      console.error('Error processing prompt:', error);
      toast({
        title: "Error",
        description: "Failed to process prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setAttemptCount(0);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleEnhancerUpdate = (enhancer: string) => {
    setSelectedEnhancer(enhancer);
    setPrompt(enhancer); // Automatically set the prompt when enhancer is updated
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Testing Playground</h1>
      
      <div className="grid gap-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">1. Select Model</h2>
          <ModelSelector
            models={models || []}
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
            isLoading={!models}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">2. Select Use Case (Optional)</h2>
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            onEnhancerUpdate={handleEnhancerUpdate}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">3. Enter Your Prompt</h2>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="min-h-[200px]"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isProcessing || !selectedModel || !prompt.trim()}
          className="w-full"
        >
          {isProcessing ? "Processing..." : "Process Prompt"}
        </Button>

        {(usedModel || usedPrompt) && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Processing Details</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><span className="font-medium">Model Used:</span> {usedModel}</p>
              <p><span className="font-medium">Prompt Used:</span></p>
              <div className="bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                {usedPrompt}
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Result</h2>
            <div className="border rounded-lg p-4 bg-background min-h-[200px] whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}
      </div>

      <LoadingModal 
        open={isProcessing}
        currentModel={currentModel}
        attemptCount={attemptCount}
      />
    </div>
  );
}