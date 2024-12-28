import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsDisplayProps {
  result: string;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const { toast } = useToast();

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
      <div className="results-display border border-input rounded-lg p-4 min-h-[200px] bg-background">
        <pre className="whitespace-pre-wrap">{result || "Results will appear here..."}</pre>
      </div>
      {result && (
        <Button onClick={copyToClipboard} variant="outline" className="w-full">
          <Copy className="mr-2 h-4 w-4" />
          Copy to Clipboard
        </Button>
      )}
    </div>
  );
}