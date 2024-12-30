import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Model } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ModelSelectorProps {
  onModelSelect: (modelId: string) => void;
  selectedModel: string;
  models?: Model[]; // Make models optional to maintain backward compatibility
}

export function ModelSelector({ onModelSelect, selectedModel, models }: ModelSelectorProps) {
  const { data: modelsInUse = [], isLoading: isModelsInUseLoading } = useQuery({
    queryKey: ['models-in-use'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('models_in_use')
        .select('model_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    },
    initialData: [],
    enabled: !models, // Only fetch if models prop is not provided
  });

  const { data: fetchedModels = [], isLoading: isModelsLoading, error } = useQuery({
    queryKey: ['available-models', modelsInUse],
    queryFn: async () => {
      const modelIds = modelsInUse?.map(m => m.model_id).filter(Boolean);
      
      if (!modelIds?.length) {
        return [];
      }

      const { data, error } = await supabase
        .from('available_models')
        .select('*')
        .in('id', modelIds)
        .eq('is_active', true);

      if (error) throw error;
      return (data || []) as Model[];
    },
    enabled: Array.isArray(modelsInUse) && modelsInUse.length > 0 && !models, // Only fetch if models prop is not provided
    initialData: [],
  });

  const isLoading = isModelsInUseLoading || isModelsLoading;
  const displayModels = models || fetchedModels; // Use provided models or fetched models

  if (isLoading && !models) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (error && !models) {
    console.error('Error in ModelSelector:', error);
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Error loading models" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedModel} onValueChange={onModelSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {displayModels.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}