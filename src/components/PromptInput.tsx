import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getTemplateForCategory } from "./CategorySelector";

interface PromptInputProps {
  selectedCategory: string;
  onSubmit: (enhancedPrompt: string) => void;
}

export function PromptInput({ selectedCategory, onSubmit }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    
    setIsEnhancing(true);
    const template = getTemplateForCategory(selectedCategory);
    const enhancedPrompt = template.replace("{prompt}", prompt.trim());
    onSubmit(enhancedPrompt);
    setIsEnhancing(false);
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your prompt here..."
        className="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        disabled={!prompt.trim() || isEnhancing}
        className="w-full"
      >
        {isEnhancing ? "Enhancing..." : "Enhance & Submit"}
      </Button>
    </div>
  );
}