import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchModels } from "@/lib/openrouter";
import { Input } from "@/components/ui/input";
import { Search, Palette, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FilterSheet } from "@/components/models/FilterSheet";
import { Model } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { generateColorTheme, ColorTheme } from "@/lib/colorUtils";
import { ModelsList } from "@/components/models/ModelsList";
import { SelectedModels } from "@/components/models/SelectedModels";

export default function Models() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [contextLength, setContextLength] = useState([0]);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(generateColorTheme());
  const [isThemeLocked, setIsThemeLocked] = useState(false);
  const { toast } = useToast();

  // Fetch API key from Supabase
  const { data: apiKeyData } = useQuery({
    queryKey: ['apiKey'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: apiKeyData } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('user_id', user.id)
        .eq('provider', 'openrouter')
        .eq('is_active', true)
        .single();

      return apiKeyData;
    },
  });

  // Fetch models from OpenRouter
  const { data: models, isLoading } = useQuery({
    queryKey: ['models', apiKeyData?.key_value],
    queryFn: async () => {
      if (!apiKeyData?.key_value) return [];
      return fetchModels(apiKeyData.key_value);
    },
    enabled: !!apiKeyData?.key_value,
  });

  // Fetch selected models
  const { data: selectedModels = [], refetch: refetchSelectedModels } = useQuery({
    queryKey: ['selectedModels'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('model_preferences')
        .select('model_id')
        .eq('user_id', user.id)
        .eq('is_enabled', true);

      if (!data) return [];

      return models?.filter(model => 
        data.some(pref => pref.model_id === model.id)
      ) || [];
    },
    enabled: !!models,
  });

  // Get unique providers
  const providers = [...new Set(models?.map(model => model.id.split('/')[0]) || [])];

  // Get max context length
  const maxContextLength = Math.max(...(models?.map(model => model.context_length || 0) || [0]));

  // Filter models based on search term and filters
  const filteredModels = models?.filter(model => {
    const matchesSearch = 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvider = 
      selectedProvider === "all" || 
      model.id.split('/')[0] === selectedProvider;
    
    const matchesContext = 
      !contextLength[0] || 
      (model.context_length || 0) >= contextLength[0];

    return matchesSearch && matchesProvider && matchesContext;
  }) || [];

  const addModel = async (model: Model) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const [provider] = model.id.split('/');
      
      // First, ensure the model exists in available_models
      const { error: modelError } = await supabase
        .from('available_models')
        .upsert({
          model_id: model.id,
          name: model.name || model.id,
          provider: provider,
          description: model.description || '',
          context_length: model.context_length,
          is_active: true
        }, {
          onConflict: 'model_id'
        });

      if (modelError) throw modelError;

      // Then, create the user preference
      const { error: prefError } = await supabase
        .from('model_preferences')
        .upsert({
          user_id: user.id,
          model_id: model.id,
          provider: provider,
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

  const handleRemoveModel = (modelId: string) => {
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

  // Apply the dynamic theme styles
  const themeStyle = {
    backgroundColor: currentTheme.background,
    color: currentTheme.foreground,
  };

  const cardStyle = {
    backgroundColor: currentTheme.primary,
    color: currentTheme.foreground === currentTheme.primary ? '#FFFCF2' : currentTheme.foreground,
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={themeStyle}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Available Models</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={generateNewTheme}
              disabled={isThemeLocked}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Palette className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={lockCurrentTheme}
              disabled={isThemeLocked}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
            >
              <Check className="h-4 w-4" />
            </Button>
            <FilterSheet
              providers={providers}
              maxContextLength={maxContextLength}
              selectedProvider={selectedProvider}
              contextLength={contextLength}
              onProviderChange={setSelectedProvider}
              onContextLengthChange={setContextLength}
            />
          </div>
        </div>

        <SelectedModels 
          models={selectedModels} 
          onRemove={handleRemoveModel}
        />

        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: currentTheme.foreground }} />
            <Input
              type="search"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              style={{
                backgroundColor: currentTheme.secondary,
                color: currentTheme.foreground,
                borderColor: currentTheme.accent,
              }}
            />
          </div>

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