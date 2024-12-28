import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ModelSelector } from "@/components/ModelSelector";
import { Model } from "@/lib/types";

interface UseUseCaseModalProps {
  useCase: {
    title: string;
    enhancer: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UseUseCaseModal({ useCase, open, onOpenChange }: UseUseCaseModalProps) {
  const [userPrompt, setUserPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Fetch user's selected models
  const { data: models = [] } = useQuery({
    queryKey: ['model-preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // First get the user's model preferences
      const { data: preferences, error: preferencesError } = await supabase
        .from('model_preferences')
        .select('model_id')
        .eq('user_id', user.id)
        .eq('is_enabled', true);

      if (preferencesError) throw preferencesError;

      // Then fetch the corresponding model details
      const { data: modelDetails, error: modelsError } = await supabase
        .from('available_models')
        .select('id, name, description, provider')
        .in('model_id', preferences.map(p => p.model_id));

      if (modelsError) throw modelsError;

      return modelDetails.map(model => ({
        id: model.id,
        name: model.name,
        description: model.description,
        provider: model.provider
      })) as Model[];
    },
  });

  // Find the selected model's name
  const selectedModelName = models.find(m => m.id === selectedModel)?.name || '';

  const handleEnhancePrompt = async () => {
    if (!userPrompt.trim() || !selectedModel) {
      toast({
        title: "Error",
        description: "Please enter a prompt and select a model",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Combine the user's prompt with the use case enhancer
      const combinedPrompt = `${useCase.enhancer}\n\nOriginal prompt: ${userPrompt.trim()}`;
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate', {
        body: {
          model: selectedModel,
          prompt: combinedPrompt,
        },
      });

      if (error) throw error;
      
      setEnhancedPrompt(data.generatedText || 'Failed to enhance prompt');
    } catch (err) {
      console.error('Error enhancing prompt:', err);
      toast({
        title: "Error",
        description: "Failed to enhance prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      toast({
        title: "Copied!",
        description: "Enhanced prompt copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            Enhance your prompt using: {useCase.title}
            {selectedModelName && (
              <div className="text-sm text-muted-foreground mt-1">
                {selectedModelName}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Select Model</h4>
              <ModelSelector
                models={models}
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
              />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Your Prompt</h4>
              <Textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="h-[300px]"
              />
            </div>
            <Button 
              onClick={handleEnhancePrompt} 
              className="w-full"
              disabled={isProcessing || !selectedModel || !userPrompt.trim()}
            >
              {isProcessing ? "Enhancing..." : "Enhance Prompt"}
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Enhanced Prompt</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!enhancedPrompt}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
            <div className="relative">
              <Textarea
                value={enhancedPrompt}
                readOnly
                placeholder="Enhanced prompt will appear here..."
                className="h-[300px]"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}