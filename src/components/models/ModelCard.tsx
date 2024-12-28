import { Model } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { CSSProperties } from "react";
import { ModelCardHeader } from "./ModelCardHeader";
import { ModelDescription } from "./ModelDescription";
import { ModelInfo } from "./ModelInfo";

interface ModelCardProps {
  model: Model;
  onAdd: (model: Model) => void;
  onRemove?: (modelId: string) => void;
  isInUse?: boolean;
  style?: CSSProperties;
}

export function ModelCard({ model, onAdd, onRemove, isInUse = false, style }: ModelCardProps) {
  const capitalizeFirstLetter = (str: string) => str?.charAt(0).toUpperCase() + str?.slice(1);
  
  const getModelSubtitle = () => {
    if (model.p_provider && model.p_model) {
      return `${capitalizeFirstLetter(model.p_provider)}'s ${model.p_model}`;
    }
    return "";
  };

  const cardClasses = `p-[3%] ${isInUse ? 'border-emerald-500 border-2' : ''}`;
  const dividerClasses = `border-t pt-2 ${isInUse ? 'border-emerald-500' : 'border-border'}`;
  const titleClasses = `text-[20px] text-left scrolling-text whitespace-nowrap text-ellipsis overflow-hidden ${isInUse ? 'text-emerald-500' : ''}`;

  return (
    <Card style={style} className={cardClasses}>
      <CardHeader className="space-y-1 p-0">
        <ModelCardHeader 
          model={model} 
          onAdd={onAdd} 
          onRemove={onRemove}
          isInUse={isInUse}
        />
        <div className={dividerClasses}>
          <CardDescription className="text-left font-medium">
            {getModelSubtitle()}
          </CardDescription>
          <ModelDescription description={model.description} />
        </div>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <div className="space-y-4">
          <ModelInfo model={model} />
        </div>
      </CardContent>
    </Card>
  );
}