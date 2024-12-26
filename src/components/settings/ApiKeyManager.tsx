import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchModels } from "@/lib/openrouter";
import { supabase } from "@/integrations/supabase/client";

interface ApiKeyManagerProps {
  onApiKeyValidated: (key: string) => void;
}

export function ApiKeyManager({ onApiKeyValidated }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

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
        <Button onClick={validateApiKey} disabled={isValidating}>
          {isValidating ? "Validating..." : "Validate"}
        </Button>
      </div>
    </div>
  );
}