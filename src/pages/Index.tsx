import { useState } from "react";
import { ModelSelector } from "@/components/ModelSelector";
import { CategorySelector } from "@/components/CategorySelector";
import { PromptInput } from "@/components/PromptInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Model } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [result, setResult] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch models in use from the database
  const { data: modelsInUse = [], isError: isModelsInUseError } = useQuery({
    queryKey: ['models-in-use'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to use models",
          variant: "destructive",
        });
        return [];
      }

      const { data, error } = await supabase
        .from('models_in_use')
        .select('model_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching models in use:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  // Fetch details for models in use
  const { data: models = [], isError: isModelsError } = useQuery({
    queryKey: ['available-models', modelsInUse],
    queryFn: async () => {
      if (!modelsInUse?.length) return [];
      
      const modelIds = modelsInUse.map(m => m.model_id);
      if (!modelIds?.length) return [];

      const { data, error } = await supabase
        .from('available_models')
        .select('*')
        .in('id', modelIds)
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching available models:', error);
        throw error;
      }

      return data as Model[];
    },
    enabled: !!modelsInUse?.length,
  });

  if (isModelsInUseError || isModelsError) {
    toast({
      title: "Error loading models",
      description: "There was an error loading your models. Please try again.",
      variant: "destructive",
    });
  }

  const handlePromptSubmit = async (enhancedPrompt: string) => {
    // TODO: Integrate with OpenRouter API
    setResult("This is a placeholder response. Please configure your OpenRouter API key in settings.");
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">PeekoPrompter</h1>
          <Button variant="ghost" onClick={() => navigate("/settings")}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex gap-4 flex-col sm:flex-row">
              <ModelSelector
                models={models}
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
              />
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Prompt</h2>
              <PromptInput
                selectedCategory={selectedCategory}
                onSubmit={handlePromptSubmit}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Results</h2>
            <ResultsDisplay result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}