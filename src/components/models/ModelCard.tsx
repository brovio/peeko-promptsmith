import { Model } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
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
    
    // Add provider info
    points.push(`Provider: ${model.id.split('/')[0]}`);
    
    // Add context length if available
    if (model.context_length) {
      points.push(`Context Length: ${model.context_length.toLocaleString()}`);
    }
    
    // Add pricing info if available
    if (model.pricing) {
      points.push(`Prompt: $${model.pricing.prompt}/1K tokens`);
      points.push(`Completion: $${model.pricing.completion}/1K tokens`);
    }
    
    return points;
  };

  const bulletPoints = generateBulletPoints();

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200" style={style}>
      <CardHeader className="relative pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-left text-xl">{model.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAdd(model)}
            className="hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <div className="h-px bg-border mx-6 my-4" />

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground text-left">Description</h4>
          <CardDescription className="text-sm text-foreground text-left">
            {model.description}
          </CardDescription>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground text-left">Model Details</h4>
          <ul className="space-y-3 list-disc list-inside text-left">
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