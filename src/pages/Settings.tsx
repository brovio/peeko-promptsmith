import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchModels } from "@/lib/openrouter";
import { Model } from "@/lib/types";
import { ModelSelector } from "@/components/ModelSelector";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Provider {
  id: string;
  name: string;
  description: string;
}

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch models from OpenRouter
  const { data: models = [], isLoading: isLoadingModels } = useQuery({
    queryKey: ['models', apiKey],
    queryFn: () => fetchModels(apiKey),
    enabled: !!apiKey,
  });

  // Extract unique providers from models
  const providers: Provider[] = Array.from(
    new Set(models.map(model => {
      const [provider] = model.id.split('/');
      return provider;
    }))
  ).map(provider => ({
    id: provider,
    name: provider.charAt(0).toUpperCase() + provider.slice(1),
    description: `Models from ${provider}`
  }));

  // Filter models by selected provider
  const filteredModels = models.filter(model => 
    model.id.startsWith(selectedProvider + '/')
  );

  // Save model preference mutation
  const saveModelPreference = useMutation({
    mutationFn: async ({ modelId, provider }: { modelId: string, provider: string }) => {
      const { error } = await supabase
        .from('model_preferences')
        .upsert({
          model_id: modelId,
          provider: provider,
          is_enabled: true,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelPreferences'] });
      toast({
        title: "Success",
        description: "Model preference saved",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save model preference",
        variant: "destructive",
      });
      console.error('Error saving model preference:', error);
    },
  });

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      const models = await fetchModels(apiKey);
      toast({
        title: "Success",
        description: "API key validated successfully",
      });
      
      // Save API key to Supabase
      const { error } = await supabase
        .from('api_keys')
        .upsert({
          provider: 'openrouter',
          key_value: apiKey,
          is_active: true,
        });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid API key",
        variant: "destructive",
      });
      console.error('Error validating API key:', error);
    } finally {
      setIsValidating(false);
    }
  };

  // Handle model selection
  const handleModelSelect = async (modelId: string) => {
    setSelectedModel(modelId);
    const provider = modelId.split('/')[0];
    await saveModelPreference.mutateAsync({ modelId, provider });
  };

  // Handle provider selection
  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setSelectedModel(""); // Reset selected model when provider changes
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">OpenRouter API Key</h2>
          <p className="text-muted-foreground">
            Enter your OpenRouter API key to access available language models.
          </p>
          <div className="flex gap-4">
            <Input
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button onClick={validateApiKey} disabled={isValidating}>
              {isValidating ? "Validating..." : "Validate"}
            </Button>
          </div>
        </div>

        {apiKey && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Model Selection</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Provider</label>
                <ModelSelector
                  models={providers}
                  selectedModel={selectedProvider}
                  onModelSelect={handleProviderSelect}
                  searchPlaceholder="Search providers..."
                />
              </div>

              {selectedProvider && (
                <div>
                  <label className="block text-sm font-medium mb-2">Model</label>
                  <ModelSelector
                    models={filteredModels}
                    selectedModel={selectedModel}
                    onModelSelect={handleModelSelect}
                    searchPlaceholder="Search models..."
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}