import { PromptInput } from "@/components/PromptInput";

interface PromptSectionProps {
  selectedCategory: string;
  selectedEnhancer: string;
  selectedModel: string; // Add this prop
  onSubmit: (enhancedPrompt: string) => void;
}

export function PromptSection({
  selectedCategory,
  selectedEnhancer,
  selectedModel, // Add this prop
  onSubmit,
}: PromptSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Prompt</h2>
      <PromptInput
        selectedCategory={selectedCategory}
        selectedEnhancer={selectedEnhancer}
        selectedModel={selectedModel}
        onSubmit={onSubmit}
      />
    </div>
  );
}