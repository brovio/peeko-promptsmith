import { Model } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";

interface ModelCardProps {
  model: Model;
  onAdd: (model: Model) => void;
  onRemove?: (modelId: string) => void;
  isInUse?: boolean;
  style?: React.CSSProperties;
}

export function ModelCard({ model, onAdd, onRemove, isInUse = false, style }: ModelCardProps) {
  const handleClick = () => {
    if (isInUse && onRemove) {
      onRemove(model.id);
    } else {
      onAdd(model);
    }
  };

  return (
    <Card 
      className={`relative transition-all duration-200 ${
        isInUse ? 'border-primary border-2' : 'hover:border-muted'
      }`}
      style={style}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-start">
          <span>{model.clean_model_name}</span>
          <Button
            variant={isInUse ? "outline" : "default"}
            size="sm"
            onClick={handleClick}
            className={`ml-2 ${isInUse ? 'text-primary' : ''}`}
          >
            {isInUse ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {model.provider}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {model.description || "No description available"}
        </p>
      </CardContent>
    </Card>
  );
}