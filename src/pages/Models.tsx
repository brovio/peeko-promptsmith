import { useState, useEffect } from "react";
import { ModelsHeader } from "@/components/models/ModelsHeader";
import { filterModels } from "@/lib/modelUtils";
import { useModelsData } from "@/components/models/useModelsData";
import { ModelOperations } from "@/components/models/ModelOperations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ModelsErrorBoundary } from "@/components/models/ModelsErrorBoundary";
import { ModelsContainer } from "@/components/models/ModelsContainer";

export default function Models() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [contextLength, setContextLength] = useState([0]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Refetch all relevant queries when auth state changes
        queryClient.invalidateQueries({ queryKey: ['models-in-use'] });
        queryClient.invalidateQueries({ queryKey: ['available-models'] });
        queryClient.invalidateQueries({ queryKey: ['selectedModels'] });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const {
    models,
    selectedModels,
    isLoading,
    modelsError,
    selectedModelsError,
    refetchModels,
    refetchSelectedModels
  } = useModelsData();

  const { data: modelsInUse = [] } = useQuery({
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
      return data.map(m => m.model_id);
    }
  });

  const { handleAddModel, handleRemoveModel } = ModelOperations({
    onSuccess: refetchSelectedModels
  });

  const providers = Array.from(
    new Set((models || []).map((model) => model.provider))
  );

  const maxContextLength = Math.max(
    ...(models?.map((model) => model.context_length || 0) || [0])
  );

  const filteredModels = filterModels(models, searchTerm, selectedProvider, contextLength);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="container mx-auto py-8 px-4">
        <ModelsHeader
          providers={providers}
          maxContextLength={maxContextLength}
          selectedProvider={selectedProvider}
          contextLength={contextLength}
          onProviderChange={setSelectedProvider}
          onContextLengthChange={setContextLength}
        />

        <ModelsErrorBoundary
          modelsError={modelsError}
          selectedModelsError={selectedModelsError}
          refetchModels={refetchModels}
          refetchSelectedModels={refetchSelectedModels}
        />

        <ModelsContainer
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          isLoading={isLoading}
          filteredModels={filteredModels}
          onAdd={handleAddModel}
          onRemove={handleRemoveModel}
          modelsInUse={modelsInUse}
        />
      </div>
    </div>
  );
}
