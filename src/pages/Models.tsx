import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Model } from "@/lib/types";
import { generateColorTheme, ColorTheme } from "@/lib/colorUtils";
import { ModelsList } from "@/components/models/ModelsList";
import { SelectedModels } from "@/components/models/SelectedModels";
import { SearchModels } from "@/components/models/SearchModels";
import { ModelsHeader } from "@/components/models/ModelsHeader";
import { useToast } from "@/hooks/use-toast";
import { fetchModels } from "@/lib/openrouter";
import { filterModels } from "@/lib/modelUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export default function Models() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [contextLength, setContextLength] = useState([0]);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(generateColorTheme());
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
        data.some(pref => pref.model_id === model.id)
      ) || [];
    },
    enabled: !!models,
    retry: 1,
  });

  const providers = Array.from(
    new Set((models || []).map(model => model.provider))
  );

  const maxContextLength = Math.max(
    ...(models?.map(model => model.context_length || 0) || [0])
  );

  const addModel = async (model: Model) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error: modelError } = await supabase
        .from('available_models')
        .upsert({
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

      if (modelError) throw modelError;

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

      refetchSelectedModels();
      toast({
        title: "Success",
        description: `Model ${model.name} added successfully`,
      });
    } catch (error) {
      console.error('Error adding model:', error);
      toast({
        title: "Error",
        description: "Failed to add model",
        variant: "destructive",
      });
    }
  };

  const handleRemoveModel = () => {
    refetchSelectedModels();
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
            <ReloadIcon className="mr-2 h-4 w-4" />
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
              onAdd={addModel}
              cardStyle={cardStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
