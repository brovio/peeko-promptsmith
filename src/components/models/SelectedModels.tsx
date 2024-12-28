import { Model } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MinusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SelectedModelsProps {
  models: Model[];
  onRemove: (modelId: string) => void;
}

export function SelectedModels({ models, onRemove }: SelectedModelsProps) {
  const { toast } = useToast();
  
  const formatNumber = (num: number) => num.toLocaleString();
  
  const getModelInfo = (model: Model) => {
    const info = [];
    
    // Add context length if available
    if (model.context_length) {
      info.push(`${formatNumber(model.context_length)} context length`);
    }
    
    // Add pricing info if available
    if (model.input_price || model.output_price) {
      info.push(`$${model.input_price}/M input tokens • $${model.output_price}/M output tokens`);
    }

    // Add max tokens if available
    if (model.max_tokens) {
      info.push(`${formatNumber(model.max_tokens)} max output tokens`);
    }

    // Add provider info
    info.push(`by ${model.provider}`);
    
    return info;
  };

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
      <h2 className="text-xl font-semibold mb-4 text-left">Selected Models</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => (
          <Card key={model.id}>
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-2xl text-left">
                    {model.clean_model_name}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(model.id)}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-left">
                {model.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-left text-muted-foreground">
                {getModelInfo(model).map((info, index) => (
                  <p key={index}>{info}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}