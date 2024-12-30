import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Info } from "lucide-react";

export function ModelCardPreview() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">GPT-4 Turbo</CardTitle>
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
        <CardDescription>
          OpenAI's most capable model, optimized for chat
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Context Length:</span>
            <span>128k tokens</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Input Price:</span>
            <span>$0.01/1K tokens</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}