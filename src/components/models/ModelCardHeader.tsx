import { Model } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ModelCardHeaderProps {
  model: Model;
  onAdd: (model: Model) => void;
  onRemove?: (modelId: string) => void;
  isInUse?: boolean;
}

export function ModelCardHeader({ model, onAdd, onRemove, isInUse = false }: ModelCardHeaderProps) {
  const getModelTitle = () => {
    return model.p_model || capitalizeFirstLetter(model.clean_model_name);
  };

  const capitalizeFirstLetter = (str: string) => str?.charAt(0).toUpperCase() + str?.slice(1);

  const handleAction = () => {
    if (isInUse && onRemove) {
      onRemove(model.id);
    } else {
      onAdd(model);
    }
  };

  return (
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
          onClick={handleAction}
        >
          {isInUse ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}