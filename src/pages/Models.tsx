import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateColorTheme } from "@/lib/colorUtils";
import { ModelsList } from "@/components/models/ModelsList";
import { SelectedModels } from "@/components/models/SelectedModels";
import { SearchModels } from "@/components/models/SearchModels";
import { ModelsHeader } from "@/components/models/ModelsHeader";
import { useToast } from "@/hooks/use-toast";
import { fetchModels } from "@/lib/openrouter";
import { filterModels } from "@/lib/modelUtils";
import { ErrorDisplay } from "@/components/models/ErrorDisplay";
import { Model } from "@/lib/types";

export default function Models() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [contextLength, setContextLength] = useState([0]);
  const [currentTheme, setCurrentTheme] = useState(generateColorTheme());
  const [isThemeLocked, setIsThemeLocked] = useState(false);
  const { toast } = useToast();

  // Fetch API key with error handling
  const { 
    data: apiKeyData, 
    error: apiKeyError,
    refetch: refetchApiKey 
  } = useQuery({
    queryKey: ['apiKey'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data: apiKeyData, error } = await supabase
          .from('api_keys')
          .select('key_value')
          .eq('user_id', user.id)
          .eq('provider', 'openrouter')
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;
        return apiKeyData;
      } catch (error: any) {
        console.error('Error fetching API key:', error);
        throw new Error(error.message || 'Failed to fetch API key');
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { 
    data: models, 
    isLoading, 
    error: modelsError,
    refetch: refetchModels 
  } = useQuery({
    queryKey: ['models', apiKeyData?.key_value],
    queryFn: async () => {
      if (!apiKeyData?.key_value) return [];
      try {
        return await fetchModels(apiKeyData.key_value);
      } catch (error: any) {
        console.error('Error fetching models:', error);
        throw new Error(error.message || 'Failed to fetch models');
      }
    },
    enabled: !!apiKeyData?.key_value,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch selected models with error handling
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

        const { data, error } = await supabase
          .from('model_preferences')
          .select('model_id')
          .eq('user_id', user.id)
          .eq('is_enabled', true);

        if (error) throw error;
        if (!data) return [];

        return models?.filter(model => 
          data.some(preference => preference.model_id === model.id)
        ) || [];
      } catch (error: any) {
        console.error('Error fetching selected models:', error);
        throw new Error(error.message || 'Failed to fetch selected models');
      }
    },
    enabled: !!models,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const providers: string[] = Array.from(
    new Set((models || []).map((model: Model) => model.provider))
  );

  const maxContextLength = Math.max(
    ...(models?.map((model) => model.context_length || 0) || [0])
  );

  const handleAddModel = async (model: Model) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // First ensure the model exists in available_models
      await supabase
        .from('available_models')
        .upsert({
          id: model.id,
          model_id: model.id,
          name: model.name,
          provider: model.provider,
          description: model.description || '',
          context_length: model.context_length,
          input_price: model.input_price,
          output_price: model.output_price,
          max_tokens: model.max_tokens,
          is_active: true,
          clean_model_name: model.clean_model_name
        }, {
          onConflict: 'model_id'
        });

      // Then add it to user preferences
      const { error } = await supabase
        .from('model_preferences')
        .upsert({
          user_id: user.id,
          model_id: model.id,
          provider: model.provider,
          is_enabled: true
        });

      if (error) throw error;

      await refetchSelectedModels();
      toast({
        title: "Model Added",
        description: `${model.name} has been added to your selected models.`
      });
    } catch (error: any) {
      console.error('Error adding model:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add model. Please try again."
      });
    }
  };

  const handleRemoveModel = async (modelId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('model_preferences')
        .delete()
        .eq('user_id', user.id)
        .eq('model_id', modelId);

      if (error) throw error;

      await refetchSelectedModels();
      toast({
        title: "Model Removed",
        description: "Model removed successfully"
      });
    } catch (error) {
      console.error('Error removing model:', error);
      toast({
        title: "Error",
        description: "Failed to remove model",
        variant: "destructive"
      });
    }
  };

  const generateNewTheme = () => {
    if (!isThemeLocked) {
      setCurrentTheme(generateColorTheme());
    }
  };

  const lockCurrentTheme = () => {
    setIsThemeLocked(true);
    toast({
      title: "Theme Locked! 🎨",
      description: "This color combination has been saved as your preference."
    });
  };

  const themeStyle = {
    backgroundColor: currentTheme.background,
    color: currentTheme.foreground
  };

  const filteredModels = filterModels(models, searchTerm, selectedProvider, contextLength);

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={themeStyle}
    >
      <div className="container mx-auto py-8 px-4">
        <ModelsHeader
          providers={providers}
          maxContextLength={maxContextLength}
          selectedProvider={selectedProvider}
          contextLength={contextLength}
          currentTheme={currentTheme}
          isThemeLocked={isThemeLocked}
          onProviderChange={setSelectedProvider}
          onContextLengthChange={setContextLength}
          onGenerateNewTheme={generateNewTheme}
          onLockTheme={lockCurrentTheme}
        />

        {apiKeyError && (
          <ErrorDisplay 
            error={apiKeyError} 
            onRetry={refetchApiKey}
          />
        )}

        {modelsError && (
          <ErrorDisplay 
            error={modelsError} 
            onRetry={refetchModels}
          />
        )}

        {selectedModelsError && (
          <ErrorDisplay 
            error={selectedModelsError} 
            onRetry={refetchSelectedModels}
          />
        )}

        <SelectedModels 
          models={selectedModels}
          onRemove={handleRemoveModel}
        />

        <div className="space-y-6">
          <SearchModels
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            currentTheme={currentTheme}
          />

          {isLoading ? (
            <div className="text-center">Loading models...</div>
          ) : !apiKeyData?.key_value ? (
            <div className="text-center">
              Please add your OpenRouter API key in settings to view available models.
            </div>
          ) : (
            <ModelsList
              models={filteredModels}
              onAdd={handleAddModel}
              cardStyle={themeStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
