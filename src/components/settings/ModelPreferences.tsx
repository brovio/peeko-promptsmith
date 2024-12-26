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

  // Extract unique providers from models
  const providers = Array.from(
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
          label="Provider"
          models={providers}
          selectedModel={selectedProvider}
          onModelSelect={onProviderSelect}
          searchPlaceholder="Search providers..."
        />

        {selectedProvider && (
          <ModelSelector
            label="Model"
            models={filteredModels}
            selectedModel={selectedModel}
            onModelSelect={handleModelSelect}
            searchPlaceholder="Search models..."
          />
        )}
      </div>
    </div>
  );
}