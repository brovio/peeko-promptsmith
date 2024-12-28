import { Model } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { ModelParametersModal } from "./ModelParametersModal";

interface ModelInfoProps {
  model: Model;
}

export function ModelInfo({ model }: ModelInfoProps) {
  const formatNumber = (num: number) => num?.toLocaleString() || 'Unknown';

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Extra Info</h3>
        <ModelParametersModal trigger={
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
            <Info className="h-4 w-4" />
          </Button>
        } />
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Context Length:</span>
          <span>{model.context_length ? formatNumber(model.context_length) : 'Unknown'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Input Price:</span>
          <span>{model.input_price ? `$${model.input_price}/1M tokens` : 'Unknown'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Output Price:</span>
          <span>{model.output_price ? `$${model.output_price}/1M tokens` : 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
}