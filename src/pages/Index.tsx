import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Model } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { HomeHeader } from "@/components/home/Header";
import { MainContent } from "@/components/home/MainContent";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function Index() {
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEnhancer, setSelectedEnhancer] = useState("");
  const [result, setResult] = useState("");
  const [metadata, setMetadata] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error checking auth state:', error);
        toast({
          title: "Authentication Error",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
      }
    };

    checkAuth();
  }, [toast]);

  const { 
    data: modelsInUse = [], 
    isError: isModelsInUseError,
    isLoading: isModelsInUseLoading,
    refetch: refetchModelsInUse
  } = useQuery({
    queryKey: ['models-in-use'],
    queryFn: async () => {
      console.log('Fetching models in use...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
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

  const { 
    data: models = [], 
    isError: isModelsError,
    isLoading: isModelsLoading,
    refetch: refetchModels
  } = useQuery({
    queryKey: ['available-models', modelsInUse],
    queryFn: async () => {
      const modelIds = modelsInUse?.map(m => m.model_id);
      console.log('Fetching available models with IDs:', modelIds);
      
      if (!modelIds?.length) {
        console.log('No model IDs to fetch');
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('available_models')
          .select('*')
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching available models:', error);
          throw error;
        }

        const filteredModels = data?.filter(model => 
          modelIds.includes(model.model_id)
        ) || [];

        console.log('Fetched models:', filteredModels);
        return filteredModels as Model[];
      } catch (error) {
        console.error('Failed to fetch models:', error);
        throw error;
      }
    },
    enabled: Array.isArray(modelsInUse) && modelsInUse.length > 0,
  });

  const handleRefreshModels = () => {
    console.log('Refreshing models...');
    refetchModelsInUse();
    refetchModels();
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    const model = models.find(m => m.model_id === modelId);
    console.log(`Selected model: ${model?.clean_model_name || modelId}`);
  };

  const handleCategorySelect = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    const { data: useCase } = await supabase
      .from('use_cases')
      .select('title, enhancer')
      .eq('id', categoryId)
      .single();
    
    if (useCase) {
      console.log(`Selected Use Case: ${useCase.title}`);
      console.log(`Selected Use Case Enhancer Text: ${useCase.enhancer}`);
    }
  };

  const handleEnhancerUpdate = (enhancer: string) => {
    setSelectedEnhancer(enhancer);
  };

  const handlePromptSubmit = async (enhancedPrompt: string, metadata?: any) => {
    setResult(enhancedPrompt);
    setMetadata(metadata);
  };

  if (isModelsInUseError || isModelsError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>
            There was an error loading your models. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8 px-4">
        <HomeHeader />
        {isModelsInUseLoading || isModelsLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <MainContent
            models={models}
            selectedModel={selectedModel}
            selectedCategory={selectedCategory}
            selectedEnhancer={selectedEnhancer}
            isModelsLoading={isModelsInUseLoading || isModelsLoading}
            result={result}
            metadata={metadata}
            onModelSelect={handleModelSelect}
            onCategorySelect={handleCategorySelect}
            onEnhancerUpdate={handleEnhancerUpdate}
            onPromptSubmit={handlePromptSubmit}
            onRefreshModels={handleRefreshModels}
          />
        )}
      </div>
    </div>
  );
}