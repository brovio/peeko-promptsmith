import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchModels } from "@/components/models/SearchModels";
import { ModelsList } from "@/components/models/ModelsList";
import { ModelsHeader } from "@/components/models/ModelsHeader";
import { SelectedModels } from "@/components/models/SelectedModels";
import { Model } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { fetchModels } from "@/lib/openrouter";
import { filterModels } from "@/lib/modelUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Models() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [contextLength, setContextLength] = useState([0]);
  const [currentTheme, setCurrentTheme] = useState({ background: "#ffffff", foreground: "#000000", accent: "#0066cc" });
  const [isThemeLocked, setIsThemeLocked] = useState(false);
  const { toast } = useToast();

  // Fetch API key with error handling
  const { data: apiKeyData, error: apiKeyError } = useQuery({
    queryKey: ['apiKey'],
    queryFn: async () => {
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
    },
  });

  // Fetch models with error handling
  const { 
    data: models, 
    isLoading, 
    error: modelsError,
    refetch: refetchModels 
  } = useQuery({
    queryKey: ['models', apiKeyData?.key_value],
    queryFn: async () => {
      if (!apiKeyData?.key_value) return [];
      return fetchModels(apiKeyData.key_value);
    },
    enabled: !!apiKeyData?.key_value,
    retry: 1,
  });

  // Fetch selected models with error handling
  const { 
    data: selectedModels = [], 
    error: selectedModelsError,
    refetch: refetchSelectedModels 
  } = useQuery({
    queryKey: ['selectedModels'],
    queryFn: async () => {
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
    },
    enabled: !!models,
    retry: 1,
  });

  const providers = Array.from(
    new Set((models || []).map((model) => model.provider))
  );

  const maxContextLength = Math.max(
    ...(models || []).map((model) => model.context_length || 0)
  );

  const handleModelAdd = async (model: Model) => {
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
    } catch (error) {
      console.error('Error adding model:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add model. Please try again."
      });
    }
  };

  const handleModelRemove = async (model: Model) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('model_preferences')
        .delete()
        .eq('user_id', user.id)
        .eq('model_id', model.id);

      if (error) throw error;

      await refetchSelectedModels();
      toast({
        title: "Model Removed",
        description: `${model.name} has been removed from your selected models.`
      });
    } catch (error) {
      console.error('Error removing model:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove model. Please try again."
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
      description: "This color combination has been saved as your preference.",
    });
  };

  const themeStyle = {
    backgroundColor: currentTheme.background,
    color: currentTheme.foreground,
  };

  const cardStyle = {
    backgroundColor: currentTheme.primary,
    color: currentTheme.foreground === currentTheme.primary ? '#FFFCF2' : currentTheme.foreground,
  };

  const filteredModels = filterModels(models, searchTerm, selectedProvider, contextLength);

  const renderError = (error: Error | null) => {
    if (!error) return null;
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex items-center justify-between">
          <span>Error: {error.message}</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetchModels()}
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={themeStyle}>
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

        {renderError(apiKeyError || modelsError || selectedModelsError)}

        <SelectedModels 
          models={selectedModels} 
          onRemove={handleModelRemove}
          style={themeStyle}
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
              onAdd={handleModelAdd}
              cardStyle={themeStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}