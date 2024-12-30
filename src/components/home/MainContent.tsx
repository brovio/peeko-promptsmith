import { ModelAndCategorySelectors } from "./ModelAndCategorySelectors";
import { PromptSection } from "./PromptSection";
import { ResultSection } from "./ResultSection";
import { HomeProps } from "@/lib/types";

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
  onRefreshModels,
}: HomeProps) {
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

      <ResultSection result={result} metadata={metadata} />
    </div>
  );
}