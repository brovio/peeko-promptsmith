import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchModels } from "@/lib/openrouter";
import { ModelSelector } from "@/components/ModelSelector";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check authentication and ensure profile exists
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        toast({
          title: "Authentication required",
          description: "Please log in to access settings",
          variant: "destructive",
        });
        return;
      }

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: session.user.id }]);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          toast({
            title: "Error",
            description: "Failed to create user profile",
            variant: "destructive",
          });
          return;
        }
      }
    };
    checkAuth();
  }, [navigate, toast]);

  // Fetch models from OpenRouter
  const { data: models = [], isLoading: isLoadingModels } = useQuery({
    queryKey: ['models', apiKey],
    queryFn: () => fetchModels(apiKey),
    enabled: !!apiKey,
  });

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // First validate the API key by fetching models
      await fetchModels(apiKey);
      
      // Then save the API key
      const { error } = await supabase
        .from('api_keys')
        .upsert({
          provider: 'openrouter',
          key_value: apiKey,
          is_active: true,
          user_id: user.id
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "API key validated and saved successfully",
      });
    } catch (error) {
      console.error('Error validating API key:', error);
      toast({
        title: "Error",
        description: "Failed to validate or save API key",
        variant: "destructive",
      });
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