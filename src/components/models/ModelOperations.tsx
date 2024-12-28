import { Model } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ModelOperationsProps {
  onSuccess: () => Promise<void>;
}

export function ModelOperations({ onSuccess }: ModelOperationsProps) {
  const { toast } = useToast();

  const handleAddModel = async (model: Model) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Add to user preferences
      const { error: prefError } = await supabase
        .from('model_preferences')
        .upsert({
          user_id: user.id,
          model_id: model.id,
          provider: model.provider,
          is_enabled: true
        }, {
          onConflict: 'user_id,model_id'
        });

      if (prefError) throw prefError;

      await onSuccess();
      toast({
        title: "Model Added",
        description: `${model.name} has been added to your selected models.`
      });
    } catch (error: any) {
      console.error('Error adding model:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add model. Please try again."
      });
    }
  };

  const handleRemoveModel = async (modelId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('model_preferences')
        .delete()
        .eq('user_id', user.id)
        .eq('model_id', modelId);

      if (error) throw error;

      await onSuccess();
      toast({
        title: "Model Removed",
        description: "Model removed successfully"
      });
    } catch (error) {
      console.error('Error removing model:', error);
      toast({
        title: "Error",
        description: "Failed to remove model",
        variant: "destructive"
      });
    }
  };

  return { handleAddModel, handleRemoveModel };
}