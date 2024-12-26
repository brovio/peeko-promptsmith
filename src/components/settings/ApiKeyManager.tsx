import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchModels } from "@/lib/openrouter";
import { supabase } from "@/integrations/supabase/client";
import { Unlink, RefreshCw } from "lucide-react";

interface ApiKeyManagerProps {
  onApiKeyValidated: (key: string) => void;
  onApiKeyDeleted: () => void;
}

export function ApiKeyManager({ onApiKeyValidated, onApiKeyDeleted }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasValidKey, setHasValidKey] = useState(false);
  const { toast } = useToast();

  // Fetch existing API key on component mount
  useEffect(() => {
    const fetchExistingKey = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: apiKeyData } = await supabase
        .from('api_keys')
        .select('key_value, is_active')
        .eq('user_id', user.id)
        .eq('provider', 'openrouter')
        .single();

      if (apiKeyData && apiKeyData.is_active) {
        setApiKey(apiKeyData.key_value);
        setHasValidKey(true);
        onApiKeyValidated(apiKeyData.key_value);
      }
    };

    fetchExistingKey();
  }, [onApiKeyValidated]);

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
      
      // Then save or update the API key
      const { error } = await supabase
        .from('api_keys')
        .upsert({
          provider: 'openrouter',
          key_value: apiKey,
          is_active: true,
          user_id: user.id
        }, {
          onConflict: 'user_id,provider'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "API key validated and saved successfully",
      });
      
      setHasValidKey(true);
      onApiKeyValidated(apiKey);
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

  const refreshModels = async () => {
    if (!hasValidKey) {
      toast({
        title: "Error",
        description: "Please validate your API key first",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshing(true);
    try {
      const models = await fetchModels(apiKey);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Prepare the models data for insertion
      const modelsData = models.map(model => ({
        model_id: model.id,
        name: model.name,
        provider: model.provider,
        description: model.description,
        context_length: model.context_length,
        is_active: true
      }));

      // Insert or update models in the database
      const { error } = await supabase
        .from('available_models')
        .upsert(modelsData, {
          onConflict: 'model_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Models refreshed successfully",
      });
    } catch (error) {
      console.error('Error refreshing models:', error);
      toast({
        title: "Error",
        description: "Failed to refresh models",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const unlinkApiKey = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', 'openrouter');

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key unlinked successfully",
      });

      setHasValidKey(false);
      setApiKey("");
      onApiKeyDeleted();
    } catch (error) {
      console.error('Error unlinking API key:', error);
      toast({
        title: "Error",
        description: "Failed to unlink API key",
        variant: "destructive",
      });
    }
  };

  return (
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
        {!hasValidKey ? (
          <Button onClick={validateApiKey} disabled={isValidating} className="bg-blue-500 hover:bg-blue-600">
            {isValidating ? "Validating..." : "Validate"}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" className="text-green-600 border-green-600">
              Validated
            </Button>
            <Button 
              variant="outline" 
              onClick={refreshModels} 
              disabled={isRefreshing}
              className="text-blue-600 border-blue-600"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" onClick={unlinkApiKey} className="text-destructive">
              <Unlink className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}