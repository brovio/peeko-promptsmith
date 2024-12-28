import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Model } from "@/lib/types";

export function useModelsData() {
  // Fetch models from Supabase
  const { 
    data: models = [], 
    isLoading, 
    error: modelsError,
    refetch: refetchModels 
  } = useQuery({
    queryKey: ['available-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('available_models')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data as Model[];
    },
  });

  // Fetch selected models
  const { 
    data: selectedModels = [], 
    error: selectedModelsError,
    refetch: refetchSelectedModels 
  } = useQuery({
    queryKey: ['selectedModels'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data: preferences, error } = await supabase
          .from('model_preferences')
          .select('model_id')
          .eq('user_id', user.id)
          .eq('is_enabled', true);

        if (error) throw error;
        if (!preferences) return [];

        // Filter models based on preferences
        return models?.filter(model => 
          preferences.some(pref => pref.model_id === model.id)
        ) || [];
      } catch (error: any) {
        console.error('Error fetching selected models:', error);
        throw new Error(error.message || 'Failed to fetch selected models');
      }
    },
    enabled: !!models,
  });

  return {
    models,
    selectedModels,
    isLoading,
    modelsError,
    selectedModelsError,
    refetchModels,
    refetchSelectedModels
  };
}