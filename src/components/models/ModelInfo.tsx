import { Model } from "@/lib/types";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelParametersModal } from "./ModelParametersModal";

interface ModelInfoProps {
  model: Model;
}

export function ModelInfo({ model }: ModelInfoProps) {
  const formatNumber = (num: number) => num?.toLocaleString() || '-';
  const formatPrice = (price: number) => price ? `$${price}` : '-';

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-sm">Metrics</h3>
        <ModelParametersModal trigger={
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
            <Info className="h-4 w-4" />
          </Button>
        } />
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="text-center">
          <div className="text-muted-foreground text-xs">Context</div>
          <div>{formatNumber(model.context_length)}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground text-xs">Input</div>
          <div>{formatPrice(model.input_price)}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground text-xs">Output</div>
          <div>{formatPrice(model.output_price)}</div>
        </div>
      </div>
    </div>
  );
}