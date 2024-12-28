import { Model } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ModelParametersModal } from "./ModelParametersModal";
import { CSSProperties } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ModelCardProps {
  model: Model;
  onAdd: (model: Model) => void;
  style?: CSSProperties;
}

export function ModelCard({ model, onAdd, style }: ModelCardProps) {
  const formatNumber = (num: number) => num?.toLocaleString();
  const capitalizeFirstLetter = (str: string) => str?.charAt(0).toUpperCase() + str?.slice(1);
  
  const getModelTitle = () => {
    return model.p_model || capitalizeFirstLetter(model.clean_model_name);
  };

  const getModelSubtitle = () => {
    if (model.p_provider && model.p_model) {
      return `${capitalizeFirstLetter(model.p_provider)}'s ${model.p_model}`;
    }
    return "";
  };

  return (
    <Card style={style}>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <div className="space-y-1 max-w-[200px] scroll-on-hover overflow-hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="text-[20px] text-left scrolling-text">
                    {getModelTitle()}
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getModelTitle()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            <ModelParametersModal />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAdd(model)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="border-t border-border pt-2">
          <CardDescription className="text-left font-medium">
            {getModelSubtitle()}
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
  );
}