import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";
import { Model } from "@/lib/types";

// Sample model data that matches our actual Model type
const sampleModel: Model = {
  id: "gpt-4",
  model_id: "gpt-4",
  name: "GPT-4 Turbo",
  provider: "openai",
  description: "OpenAI's most capable model, optimized for chat",
  context_length: 128000,
  input_price: 0.01,
  output_price: 0.03,
  clean_model_name: "gpt-4",
  p_provider: "OpenAI",
  p_model: "GPT-4"
};

export function ModelCardPreview() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{sampleModel.p_model}</CardTitle>
            <CardDescription>
              {`${sampleModel.p_provider}'s ${sampleModel.p_model}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="pt-2 border-t">
          {sampleModel.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-muted-foreground text-xs">Context</div>
              <div>{sampleModel.context_length?.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Input</div>
              <div>${sampleModel.input_price}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Output</div>
              <div>${sampleModel.output_price}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}