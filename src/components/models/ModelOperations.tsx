import { Model } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface ModelOperationsProps {
  onSuccess: (options?: RefetchOptions) => Promise<QueryObserverResult<Model[], Error>>;
}

export function ModelOperations({ onSuccess }: ModelOperationsProps) {
  const { toast } = useToast();

  const handleAddModel = async (model: Model) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // First check if the model is already in use
      const { data: existingModel, error: checkError } = await supabase
        .from('models_in_use')
        .select()
        .eq('user_id', user.id)
        .eq('model_id', model.id)
        .maybeSingle();

      if (checkError) throw checkError;

      let error;
      
      if (existingModel) {
        // Update the existing model
        const { error: updateError } = await supabase
          .from('models_in_use')
          .update({
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('model_id', model.id);
          
        error = updateError;
      } else {
        // Add to models in use
        const { error: useError } = await supabase
          .from('models_in_use')
          .insert({
            user_id: user.id,
            model_id: model.id,
            provider: model.provider,
            is_active: true
          });
          
        error = useError;
      }

      if (error) throw error;

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

      // Remove from models in use
      const { error: useError } = await supabase
        .from('models_in_use')
        .delete()
        .eq('user_id', user.id)
        .eq('model_id', modelId);

      if (useError) throw useError;

      // Remove from preferences
      const { error: prefError } = await supabase
        .from('model_preferences')
        .delete()
        .eq('user_id', user.id)
        .eq('model_id', modelId);

      if (prefError) throw prefError;

      await onSuccess();
      toast({
        title: "Model Removed",
        description: "Model removed successfully"
      });
    } catch (error: any) {
      console.error('Error removing model:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove model. Please try again."
      });
    }
  };

  return { handleAddModel, handleRemoveModel };
}