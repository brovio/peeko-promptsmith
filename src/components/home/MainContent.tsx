import { ModelAndCategorySelectors } from "./ModelAndCategorySelectors";
import { PromptSection } from "./PromptSection";
import { ResultSection } from "./ResultSection";
import { Model } from "@/lib/types";

interface MainContentProps {
  models: Model[];
  selectedModel: string;
  selectedCategory: string;
  selectedEnhancer: string;
  isModelsLoading: boolean;
  result: string;
  metadata?: any;
  onModelSelect: (modelId: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onEnhancerUpdate: (enhancer: string) => void;
  onPromptSubmit: (enhancedPrompt: string, metadata?: any) => void;
}

export function MainContent({
  models,
  selectedModel,
  selectedCategory,
  selectedEnhancer,
  isModelsLoading,
  result,
  metadata,
  onModelSelect,
  onCategorySelect,
  onEnhancerUpdate,
  onPromptSubmit,
}: MainContentProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <ModelAndCategorySelectors
          models={models}
          selectedModel={selectedModel}
          selectedCategory={selectedCategory}
          isModelsLoading={isModelsLoading}
          onModelSelect={onModelSelect}
          onCategorySelect={onCategorySelect}
          onEnhancerUpdate={onEnhancerUpdate}
        />

        <PromptSection
          selectedCategory={selectedCategory}
          selectedEnhancer={selectedEnhancer}
          selectedModel={selectedModel}
          onSubmit={onPromptSubmit}
        />
      </div>

      <ResultSection result={result} metadata={metadata} />
    </div>
  );
}