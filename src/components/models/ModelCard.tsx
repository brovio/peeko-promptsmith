import { Model } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ModelParametersModal } from "./ModelParametersModal";
import { CSSProperties } from "react";

interface ModelCardProps {
  model: Model;
  onAdd: (model: Model) => void;
  style?: CSSProperties;
}

export function ModelCard({ model, onAdd, style }: ModelCardProps) {
  const formatNumber = (num: number) => num.toLocaleString();
  
  const getModelInfo = () => {
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

  return (
    <Card style={style}>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl text-left">
              {model.clean_model_name}
            </CardTitle>
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
        <CardDescription className="text-left">
          {model.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-left text-muted-foreground">
          {getModelInfo().map((info, index) => (
            <p key={index}>{info}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}