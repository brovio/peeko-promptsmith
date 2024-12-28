import { Model } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Info, ChevronDown, ChevronUp } from "lucide-react";
import { ModelParametersModal } from "./ModelParametersModal";
import { CSSProperties, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ModelCardProps {
  model: Model;
  onAdd: (model: Model) => void;
  style?: CSSProperties;
}

export function ModelCard({ model, onAdd, style }: ModelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const formatNumber = (num: number) => num?.toLocaleString() || 'Unknown';
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

  const truncateText = (text: string, charLimit: number) => {
    if (!text) return "";
    if (text.length <= charLimit) return text;
    return `${text.substring(0, charLimit)}...`;
  };

  return (
    <Card style={style} className="p-[3%]">
      <CardHeader className="space-y-1 p-0">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 scroll-on-hover overflow-hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CardTitle className="text-[20px] text-left scrolling-text whitespace-nowrap text-ellipsis overflow-hidden">
                    {getModelTitle()}
                  </CardTitle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getModelTitle()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-shrink-0">
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
            <div>
              <CardDescription className="text-left mt-2">
                {isExpanded ? model.description : truncateText(model.description, 180)}
              </CardDescription>
              {model.description.length > 180 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-6 px-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <div className="flex items-center gap-1">
                      Show less <ChevronUp className="h-3 w-3" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      Read more <ChevronDown className="h-3 w-3" />
                    </div>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Extra Info</h3>
              <ModelParametersModal trigger={
                <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                  <Info className="h-4 w-4" />
                </Button>
              } />
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Context Length:</span>
                <span>{model.context_length ? formatNumber(model.context_length) : 'Unknown'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Input Price:</span>
                <span>{model.input_price ? `$${model.input_price}/1M tokens` : 'Unknown'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Output Price:</span>
                <span>{model.output_price ? `$${model.output_price}/1M tokens` : 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}