import { useState } from "react";
import { generateColorTheme } from "@/lib/colorUtils";
import { ModelsHeader } from "@/components/models/ModelsHeader";
import { filterModels } from "@/lib/modelUtils";
import { useModelsData } from "@/components/models/useModelsData";
import { ModelOperations } from "@/components/models/ModelOperations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ThemeManager } from "@/components/models/ThemeManager";
import { ModelsErrorBoundary } from "@/components/models/ModelsErrorBoundary";
import { ModelsContainer } from "@/components/models/ModelsContainer";

export default function Models() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [contextLength, setContextLength] = useState([0]);
  const [currentTheme, setCurrentTheme] = useState(generateColorTheme());

  const {
    models,
    selectedModels,
    isLoading,
    modelsError,
    selectedModelsError,
    refetchModels,
    refetchSelectedModels
  } = useModelsData();

  // Fetch models in use
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

  const themeManager = ThemeManager({
    onThemeChange: setCurrentTheme
  });

  const filteredModels = filterModels(models, searchTerm, selectedProvider, contextLength);

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.foreground
      }}
    >
      <div className="container mx-auto py-8 px-4">
        <ModelsHeader
          providers={providers}
          maxContextLength={maxContextLength}
          selectedProvider={selectedProvider}
          contextLength={contextLength}
          currentTheme={currentTheme}
          isThemeLocked={themeManager.isThemeLocked}
          onProviderChange={setSelectedProvider}
          onContextLengthChange={setContextLength}
          onGenerateNewTheme={themeManager.generateNewTheme}
          onLockTheme={themeManager.lockCurrentTheme}
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
          currentTheme={currentTheme}
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