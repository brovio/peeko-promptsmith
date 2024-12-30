import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Copy } from "lucide-react";

export function UseCasePreview() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Professional Email Writer</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">
          Transforms casual emails into professional business correspondence while maintaining the original message.
        </p>
      </CardContent>
    </Card>
  );
}