import { Model, ModelSelectorProps } from "@/lib/types";
import { RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ModelSelector({ 
  models, 
  selectedModel, 
  onModelSelect,
  isLoading = false,
  onRefresh
}: ModelSelectorProps) {
  return (
    <div className="w-full flex gap-2 items-center">
      <div className="flex-1">
        <Select value={selectedModel} onValueChange={onModelSelect} disabled={isLoading}>
          <SelectTrigger className="w-full bg-background text-foreground border-input">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading models...</span>
              </div>
            ) : (
              <SelectValue placeholder="Choose Model" />
            )}
          </SelectTrigger>
          <SelectContent className="bg-background border-input">
            {models.map((model) => (
              <SelectItem 
                key={model.id} 
                value={model.model_id}
                className="text-foreground hover:bg-muted"
              >
                {model.clean_model_name || model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {onRefresh && (
        <Button 
          variant="outline" 
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex-shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      )}
    </div>
  );
}