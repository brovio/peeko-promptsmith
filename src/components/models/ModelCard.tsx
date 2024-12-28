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
  const getModelPoints = () => {
    const points = [];
    
    // Add context length if available
    if (model.context_length) {
      points.push(`Context length: ${model.context_length.toLocaleString()} tokens`);
    }
    
    // Add pricing info if available
    if (model.input_price || model.output_price) {
      points.push(`Cost per 1M tokens: $${model.input_price} (input) / $${model.output_price} (output)`);
    }

    // Add max tokens if available
    if (model.max_tokens) {
      points.push(`Maximum output tokens: ${model.max_tokens.toLocaleString()}`);
    }

    // Add a point about the model's capabilities
    points.push(`Provider: ${model.provider}`);
    
    return points;
  };

  return (
    <Card style={style}>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl">
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
        <CardDescription>
          {model.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-1">
          {getModelPoints().map((point, index) => (
            <li key={index} className="text-sm">{point}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}