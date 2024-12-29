import { useState, useEffect } from "react";
import { ModelSelector } from "@/components/ModelSelector";
import { CategorySelector } from "@/components/CategorySelector";
import { PromptInput } from "@/components/PromptInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Model } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { LogSidebar, LogEntry } from "@/components/LogSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Index() {
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEnhancer, setSelectedEnhancer] = useState("");
  const [result, setResult] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const { toast } = useToast();

  const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLogs(prev => [...prev, { timestamp: new Date(), message, type }]);
  };

  // Check auth state on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error checking auth state:', error);
        addLog('Authentication error occurred', 'error');
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
      addLog('Fetching available models...', 'info');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        addLog('Authentication required', 'error');
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
        addLog('Failed to fetch models', 'error');
        throw error;
      }
      
      addLog('Models fetched successfully', 'success');
      return data || [];
    },
  });

  // Fetch details for models in use
  const { 
    data: models = [], 
    isError: isModelsError,
    isLoading: isModelsLoading,
    refetch: refetchModels
  } = useQuery({
    queryKey: ['available-models', modelsInUse],
    queryFn: async () => {
      const modelIds = modelsInUse?.map(m => m.model_id).filter(Boolean);
      
      if (!modelIds?.length) {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('available_models')
          .select('*')
          .in('id', modelIds)
          .eq('is_active', true);
        
        if (error) {
          console.error('Error fetching available models:', error);
          addLog('Failed to fetch model details', 'error');
          throw error;
        }

        return (data || []) as Model[];
      } catch (error) {
        console.error('Failed to fetch models:', error);
        addLog('Error loading model details', 'error');
        throw error;
      }
    },
    enabled: Array.isArray(modelsInUse) && modelsInUse.length > 0,
  });

  const handleRefreshModels = () => {
    addLog('Refreshing models...', 'info');
    refetchModelsInUse();
    refetchModels();
  };

  if (isModelsInUseError || isModelsError) {
    toast({
      title: "Error loading models",
      description: "There was an error loading your models. Please try again.",
      variant: "destructive",
    });
  }

  const handlePromptSubmit = async (enhancedPrompt: string) => {
    try {
      addLog('Processing prompt...', 'info');
      setResult(enhancedPrompt);
      addLog('Prompt processed successfully', 'success');
    } catch (error) {
      console.error('Error submitting prompt:', error);
      addLog('Failed to process prompt', 'error');
      toast({
        title: "Error",
        description: "Failed to process prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen gradient-bg flex w-full">
        <LogSidebar logs={logs} />
        <div className="container mx-auto py-8 px-4 flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">PeekoPrompter</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4 flex-col sm:flex-row">
                <ModelSelector
                  models={models}
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                  isLoading={isModelsInUseLoading || isModelsLoading}
                  onRefresh={handleRefreshModels}
                />
                <CategorySelector
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                  onEnhancerUpdate={setSelectedEnhancer}
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Prompt</h2>
                <PromptInput
                  selectedCategory={selectedCategory}
                  selectedEnhancer={selectedEnhancer}
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
    </SidebarProvider>
  );
}