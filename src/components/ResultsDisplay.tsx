import { Button } from "@/components/ui/button";
import { Copy, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface ResultsDisplayProps {
  result: string;
  metadata?: {
    processingTime: number;
    model: string;
    enhancerText: string;
    userPrompt: string;
    fullPrompt: string;
    context: string;
    inputTokens: number | string;
    outputTokens: number | string;
    cost: number | string;
  };
}

export function ResultsDisplay({ result, metadata }: ResultsDisplayProps) {
  const { toast } = useToast();
  const [showMetadata, setShowMetadata] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copied!",
        description: "Result copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="results-display border border-input rounded-lg p-4 min-h-[200px] bg-background flex-grow mr-2">
          <pre className="whitespace-pre-wrap">{result || "Results will appear here..."}</pre>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowMetadata(true)}
          disabled={!metadata}
          className={`ml-2 ${!metadata ? 'text-gray-400' : 'text-primary'}`}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
      
      {result && (
        <Button onClick={copyToClipboard} variant="outline" className="w-full">
          <Copy className="mr-2 h-4 w-4" />
          Copy to Clipboard
        </Button>
      )}

      <Dialog open={showMetadata} onOpenChange={setShowMetadata}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Prompt Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {metadata && (
              <>
                <div>
                  <span className="font-semibold">Time to generate:</span> {metadata.processingTime.toFixed(2)}s
                </div>
                <div>
                  <span className="font-semibold">Model:</span> {metadata.model}
                </div>
                <div>
                  <span className="font-semibold">Use Case Enhancer Text:</span> {metadata.enhancerText}
                </div>
                <div>
                  <span className="font-semibold">User Prompt:</span> {metadata.userPrompt}
                </div>
                <div>
                  <span className="font-semibold">Full Prompt:</span> {metadata.fullPrompt}
                </div>
                <div>
                  <span className="font-semibold">Context:</span> {metadata.context}
                </div>
                <div>
                  <span className="font-semibold">Input Tokens:</span> {metadata.inputTokens}
                </div>
                <div>
                  <span className="font-semibold">Output Tokens:</span> {metadata.outputTokens}
                </div>
                <div>
                  <span className="font-semibold">Cost:</span> ${typeof metadata.cost === 'number' ? metadata.cost.toFixed(6) : metadata.cost}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}