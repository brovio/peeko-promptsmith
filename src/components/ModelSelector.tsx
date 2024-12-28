import { Model } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

export function ModelSelector({ 
  models, 
  selectedModel, 
  onModelSelect,
}: ModelSelectorProps) {
  const filteredModels = models;

  return (
    <div className="w-full">
      <Select value={selectedModel} onValueChange={onModelSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a model from the list" />
        </SelectTrigger>
        <SelectContent>
          {filteredModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex flex-col">
                <span className="font-medium">{model.name}</span>
                {model.description && (
                  <span className="text-xs text-muted-foreground">{model.description}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}