import { Model } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MinusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SelectedModelsProps {
  models: Model[];
  onRemove: (modelId: string) => void;
}

export function SelectedModels({ models, onRemove }: SelectedModelsProps) {
  const { toast } = useToast();

  const handleRemove = async (modelId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('model_preferences')
        .delete()
        .eq('user_id', user.id)
        .eq('model_id', modelId);

      if (error) throw error;

      onRemove(modelId);
      toast({
        title: "Success",
        description: "Model removed successfully",
      });
    } catch (error) {
      console.error('Error removing model:', error);
      toast({
        title: "Error",
        description: "Failed to remove model",
        variant: "destructive",
      });
    }
  };

  if (models.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Selected Models</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <div 
            key={model.id}
            className="p-4 rounded-lg bg-white/10 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{model.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(model.id)}
                className="hover:bg-white/10"
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm opacity-80">{model.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}