import { PromptInput } from "@/components/PromptInput";

interface PromptSectionProps {
  selectedCategory: string;
  selectedEnhancer: string;
  onSubmit: (enhancedPrompt: string) => void;
}

export function PromptSection({
  selectedCategory,
  selectedEnhancer,
  onSubmit,
}: PromptSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Prompt</h2>
      <PromptInput
        selectedCategory={selectedCategory}
        selectedEnhancer={selectedEnhancer}
        onSubmit={onSubmit}
      />
    </div>
  );
}