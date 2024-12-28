import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateColorTheme } from "@/lib/colorUtils";
import { ModelsList } from "@/components/models/ModelsList";
import { SelectedModels } from "@/components/models/SelectedModels";
import { SearchModels } from "@/components/models/SearchModels";
import { ModelsHeader } from "@/components/models/ModelsHeader";
import { useToast } from "@/hooks/use-toast";
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

  // Fetch models directly from Supabase
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

      // Add to user preferences
      const { error: prefError } = await supabase
        .from('model_preferences')
        .upsert({
          user_id: user.id,
          model_id: model.id,
          provider: model.provider,
          is_enabled: true
        }, {
          onConflict: 'user_id,model_id'
        });

      if (prefError) throw prefError;

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