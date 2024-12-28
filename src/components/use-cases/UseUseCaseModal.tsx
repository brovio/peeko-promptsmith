import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UseUseCaseModalProps {
  useCase: {
    title: string;
    enhancer: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UseUseCaseModal({ useCase, open, onOpenChange }: UseUseCaseModalProps) {
  const [userPrompt, setUserPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const { toast } = useToast();

  const handleEnhancePrompt = () => {
    // For now, just append the enhancer to the user's prompt
    // This should be replaced with actual AI enhancement logic
    setEnhancedPrompt(`${userPrompt}\n\n${useCase.enhancer}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(enhancedPrompt);
      toast({
        title: "Copied!",
        description: "Enhanced prompt copied to clipboard",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Enhance your prompt using: {useCase.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Your Prompt</h4>
            <Textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="h-[300px]"
            />
            <Button onClick={handleEnhancePrompt} className="w-full">
              Enhance Prompt
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Enhanced Prompt</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!enhancedPrompt}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
            <div className="relative">
              <Textarea
                value={enhancedPrompt}
                readOnly
                placeholder="Enhanced prompt will appear here..."
                className="h-[300px]"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}