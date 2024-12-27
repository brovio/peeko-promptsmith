import { Model } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CSSProperties } from "react";

interface ModelCardProps {
  model: Model;
  onAdd: (model: Model) => void;
  style?: CSSProperties;
}

export function ModelCard({ model, onAdd, style }: ModelCardProps) {
  return (
    <div 
      className="p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      style={style}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{model.name}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAdd(model)}
          className="hover:bg-white/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm opacity-80 mb-2">{model.description}</p>
      <div className="text-xs opacity-70">
        <p>Provider: {model.id.split('/')[0]}</p>
        {model.context_length && (
          <p>Context Length: {model.context_length.toLocaleString()}</p>
        )}
        {model.pricing && (
          <div>
            <p>Prompt: ${model.pricing.prompt}/1K tokens</p>
            <p>Completion: ${model.pricing.completion}/1K tokens</p>
          </div>
        )}
      </div>
    </div>
  );
}