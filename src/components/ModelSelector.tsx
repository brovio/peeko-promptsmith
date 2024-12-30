import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Model } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ModelSelectorProps {
  onModelSelect: (modelId: string) => void;
  selectedModel: string;
  models?: Model[];
  isLoading?: boolean;
}

export function ModelSelector({ onModelSelect, selectedModel, models, isLoading: externalLoading }: ModelSelectorProps) {
  const { data: modelsInUse = [], isLoading: isModelsInUseLoading } = useQuery({
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
      console.log('Models in use:', data);
      return data || [];
    },
    initialData: [],
    enabled: !models,
  });

  const { 
    data: fetchedModels = [], 
    isLoading: isModelsLoading,
    error
  } = useQuery({
    queryKey: ['available-models', modelsInUse],
    queryFn: async () => {
      console.log('Fetching available models...');
      if (!modelsInUse?.length) {
        console.log('No models in use to fetch');
        return [];
      }

      const { data, error } = await supabase
        .from('available_models')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching available models:', error);
        throw error;
      }

      const modelIds = modelsInUse.map(m => m.model_id);
      const filteredModels = (data || []).filter(model => modelIds.includes(model.id));
      console.log('Filtered models:', filteredModels);
      return filteredModels as Model[];
    },
    enabled: Array.isArray(modelsInUse) && modelsInUse.length > 0 && !models,
    initialData: [],
  });

  const isLoading = isModelsInUseLoading || isModelsLoading || externalLoading;
  const displayModels = models || fetchedModels;

  if (isLoading && !models) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Select value={selectedModel} onValueChange={onModelSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Loading models..." : "Select a model"} />
      </SelectTrigger>
      <SelectContent>
        {error ? (
          <SelectItem value="error" disabled>Error loading models</SelectItem>
        ) : displayModels.length === 0 ? (
          <SelectItem value="empty" disabled>No models available</SelectItem>
        ) : (
          displayModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}