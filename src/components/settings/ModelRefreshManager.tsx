import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchModels } from "@/lib/openrouter";
import { refreshModelsInDatabase } from "@/utils/modelUtils";
import { RefreshCw } from "lucide-react";

interface ModelRefreshManagerProps {
  apiKey: string;
}

export function ModelRefreshManager({ apiKey }: ModelRefreshManagerProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const refreshModels = async () => {
    if (!apiKey) {
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
      await refreshModelsInDatabase(models);
      
      toast({
        title: "Success",
        description: "Models refreshed successfully",
      });
    } catch (error: any) {
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

  return (
    <Button
      variant="outline"
      onClick={refreshModels}
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh Models'}
    </Button>
  );
}