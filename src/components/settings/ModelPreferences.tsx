import { useState } from "react";
import { ModelSelector } from "@/components/ModelSelector";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ModelPreferencesProps {
  models: any[];
  selectedProvider: string;
  selectedModel: string;
  onProviderSelect: (provider: string) => void;
  onModelSelect: (model: string) => void;
}

export function ModelPreferences({
  models,
  selectedProvider,
  selectedModel,
  onProviderSelect,
  onModelSelect,
}: ModelPreferencesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Extract unique providers from models and create provider objects
  const providers = Array.from(
    new Set(models.map(model => {
      const [provider] = model.id.split('/');
      return provider;
    }))
  ).map(provider => ({
    id: provider,
    name: provider.charAt(0).toUpperCase() + provider.slice(1),
    description: `Models from ${provider}`,
    provider: provider,
    clean_model_name: provider // Adding clean_model_name for provider objects
  }));

  // Filter models by selected provider and create model objects
  const filteredModels = models
    .filter(model => model.id.startsWith(selectedProvider + '/'))
    .map(model => ({
      id: model.id,
      name: model.name,
      description: model.description,
      provider: model.id.split('/')[0],
      clean_model_name: model.name.replace(`${model.provider}/`, '').trim() // Adding clean_model_name for model objects
    }));

  // Save model preference mutation
  const saveModelPreference = useMutation({
    mutationFn: async ({ modelId, provider }: { modelId: string, provider: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('model_preferences')
        .upsert({
          model_id: modelId,
          provider: provider,
          is_enabled: true,
          user_id: user.id
        }, {
          onConflict: 'user_id,provider'
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

  const handleModelSelect = async (modelId: string) => {
    onModelSelect(modelId);
    const provider = modelId.split('/')[0];
    await saveModelPreference.mutateAsync({ modelId, provider });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Model Selection</h2>
      <div className="space-y-4">
        <ModelSelector
          models={providers}
          selectedModel={selectedProvider}
          onModelSelect={onProviderSelect}
        />

        {selectedProvider && (
          <ModelSelector
            models={filteredModels}
            selectedModel={selectedModel}
            onModelSelect={handleModelSelect}
          />
        )}
      </div>
    </div>
  );
}