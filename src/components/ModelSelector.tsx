import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Model } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ModelSelectorProps {
  onModelSelect: (modelId: string) => void;
  selectedModel: string;
}

export function ModelSelector({ onModelSelect, selectedModel }: ModelSelectorProps) {
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
  });

  const { data: models = [], isLoading: isModelsLoading, error } = useQuery({
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
    enabled: Array.isArray(modelsInUse) && modelsInUse.length > 0,
    initialData: [],
  });

  const isLoading = isModelsInUseLoading || isModelsLoading;

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (error) {
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
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}