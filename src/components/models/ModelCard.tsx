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
  // Generate bullet points for model information
  const generateBulletPoints = () => {
    const points = [];
    
    // Add context length if available
    if (model.context_length) {
      points.push(`Maximum context length: ${model.context_length.toLocaleString()} tokens`);
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
    points.push("Structure and refine your prompts specifically for this model's capabilities");
    
    return points;
  };

  const bulletPoints = generateBulletPoints();

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200" style={style}>
      <CardHeader className="relative pb-0">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">
              {model.clean_model_name}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <ModelParametersModal />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAdd(model)}
              className="hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="h-px bg-border mx-6 my-4" />

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Info on {model.provider}'s model:</h4>
          <CardDescription className="text-sm text-foreground">
            {model.description}
          </CardDescription>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Hints & Tips</h4>
          <ul className="space-y-3 list-disc list-inside">
            {bulletPoints.map((point, index) => (
              <li 
                key={index} 
                className="text-sm text-foreground leading-relaxed pl-2"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}