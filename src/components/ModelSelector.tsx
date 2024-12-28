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
  return (
    <div className="w-full">
      <Select value={selectedModel} onValueChange={onModelSelect}>
        <SelectTrigger className="w-full bg-background text-foreground border-input">
          <SelectValue placeholder="Choose Model" />
        </SelectTrigger>
        <SelectContent className="bg-background border-input">
          {models.map((model) => (
            <SelectItem 
              key={model.id} 
              value={model.id}
              className="text-foreground hover:bg-muted"
            >
              {model.clean_model_name || model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function getTemplateForCategory(categoryId: string): string {
  const category = defaultCategories.find((c) => c.id === categoryId);
  return category?.template || "{prompt}";
}
