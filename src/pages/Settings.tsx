import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchModels } from "@/lib/openrouter";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ApiKeyManager } from "@/components/settings/ApiKeyManager";
import { ModelPreferences } from "@/components/settings/ModelPreferences";

export default function Settings() {
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();
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

      // Fetch existing API key
      const { data: apiKeyData } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('user_id', session.user.id)
        .eq('provider', 'openrouter')
        .single();

      if (apiKeyData) {
        setApiKey(apiKeyData.key_value);
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

  const handleApiKeyValidated = (key: string) => {
    setApiKey(key);
  };

  const handleApiKeyDeleted = () => {
    setApiKey("");
    setSelectedProvider("");
    setSelectedModel("");
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">
        <ApiKeyManager 
          onApiKeyValidated={handleApiKeyValidated}
          onApiKeyDeleted={handleApiKeyDeleted}
        />

        {apiKey && !isLoadingModels && (
          <ModelPreferences
            models={models}
            selectedProvider={selectedProvider}
            selectedModel={selectedModel}
            onProviderSelect={setSelectedProvider}
            onModelSelect={setSelectedModel}
          />
        )}
      </div>
    </div>
  );
}