import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Model } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { LogSidebar, LogEntry } from "@/components/LogSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeHeader } from "@/components/home/Header";
import { MainContent } from "@/components/home/MainContent";

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

  const clearLogs = () => {
    setLogs([]);
  };

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
      } else if (session) {
        addLog(`Authenticated as ${session.user.email}`, 'success');
      }
    };

    checkAuth();
    addLog('Application initialized', 'info');
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
      
      addLog(`Found ${data?.length || 0} available models`, 'success');
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

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    const model = models.find(m => m.model_id === modelId);
    addLog(`Selected model: ${model?.clean_model_name || modelId}`, 'info');
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    addLog(`Selected use case category: ${categoryId}`, 'info');
  };

  const handleEnhancerUpdate = (enhancer: string) => {
    setSelectedEnhancer(enhancer);
    addLog('Updated enhancer template', 'info');
  };

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

  if (isModelsInUseError || isModelsError) {
    toast({
      title: "Error loading models",
      description: "There was an error loading your models. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground flex w-full">
        <LogSidebar logs={logs} onClear={clearLogs} />
        <div className="container mx-auto py-8 px-4 flex-1">
          <HomeHeader />
          <MainContent
            models={models}
            selectedModel={selectedModel}
            selectedCategory={selectedCategory}
            selectedEnhancer={selectedEnhancer}
            isModelsLoading={isModelsInUseLoading || isModelsLoading}
            result={result}
            onModelSelect={handleModelSelect}
            onCategorySelect={handleCategorySelect}
            onEnhancerUpdate={handleEnhancerUpdate}
            onPromptSubmit={handlePromptSubmit}
            onRefreshModels={handleRefreshModels}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}