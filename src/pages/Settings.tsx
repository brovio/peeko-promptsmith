import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchModels } from "@/lib/openrouter";
import { Model } from "@/lib/types";

export default function Settings() {
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
      const models = await fetchModels(apiKey);
      toast({
        title: "Success",
        description: "API key validated successfully",
      });
      // TODO: Store API key in Supabase
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid API key",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
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
      </div>
    </div>
  );
}