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
  onModelSelect: (modelId: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onEnhancerUpdate: (enhancer: string) => void;
  onPromptSubmit: (enhancedPrompt: string) => void;
  onRefreshModels: () => void;
}

export function MainContent({
  models,
  selectedModel,
  selectedCategory,
  selectedEnhancer,
  isModelsLoading,
  result,
  onModelSelect,
  onCategorySelect,
  onEnhancerUpdate,
  onPromptSubmit,
  onRefreshModels,
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
          onRefreshModels={onRefreshModels}
        />

        <PromptSection
          selectedCategory={selectedCategory}
          selectedEnhancer={selectedEnhancer}
          selectedModel={selectedModel}
          onSubmit={onPromptSubmit}
        />
      </div>

      <ResultSection result={result} />
    </div>
  );
}