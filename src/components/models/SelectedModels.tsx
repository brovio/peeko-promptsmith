import { Model } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MinusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModelParametersModal } from "./ModelParametersModal";

interface SelectedModelsProps {
  models: Model[];
  onRemove: (modelId: string) => void;
}

export function SelectedModels({ models, onRemove }: SelectedModelsProps) {
  const { toast } = useToast();
  
  const formatNumber = (num: number) => num?.toLocaleString();
  const capitalizeFirstLetter = (str: string) => str?.charAt(0).toUpperCase() + str?.slice(1);
  
  const getModelTitle = (model: Model) => {
    return model.p_model ? capitalizeFirstLetter(model.p_model) : capitalizeFirstLetter(model.clean_model_name);
  };

  const getModelSubtitle = (model: Model) => {
    if (model.p_provider && model.p_model) {
      return `${capitalizeFirstLetter(model.p_provider)}'s ${capitalizeFirstLetter(model.p_model)}`;
    }
    return "";
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
                  <CardTitle className="text-[20px] text-left">
                    {getModelTitle(model)}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <ModelParametersModal />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(model.id)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="border-t border-border pt-2">
                <CardDescription className="text-left font-medium">
                  {getModelSubtitle(model)}
                </CardDescription>
                {model.description && (
                  <CardDescription className="text-left mt-2">
                    {model.description}
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Extra Info</h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {model.context_length && (
                        <tr>
                          <td className="py-1 text-muted-foreground">Context Length:</td>
                          <td className="py-1 text-right">{formatNumber(model.context_length)}</td>
                        </tr>
                      )}
                      {model.input_price && (
                        <tr>
                          <td className="py-1 text-muted-foreground">Input Price:</td>
                          <td className="py-1 text-right">${model.input_price}/1M tokens</td>
                        </tr>
                      )}
                      {model.output_price && (
                        <tr>
                          <td className="py-1 text-muted-foreground">Output Price:</td>
                          <td className="py-1 text-right">${model.output_price}/1M tokens</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}