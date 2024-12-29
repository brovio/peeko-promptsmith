import { ModelSelector } from "@/components/ModelSelector";
import { CategorySelector } from "@/components/CategorySelector";
import { Model } from "@/lib/types";

interface ModelAndCategorySelectorsProps {
  models: Model[];
  selectedModel: string;
  selectedCategory: string;
  isModelsLoading: boolean;
  onModelSelect: (modelId: string) => void;
  onCategorySelect: (categoryId: string) => void;
  onEnhancerUpdate: (enhancer: string) => void;
  onRefreshModels: () => void;
}

export function ModelAndCategorySelectors({
  models,
  selectedModel,
  selectedCategory,
  isModelsLoading,
  onModelSelect,
  onCategorySelect,
  onEnhancerUpdate,
  onRefreshModels,
}: ModelAndCategorySelectorsProps) {
  return (
    <div className="flex gap-4 flex-col sm:flex-row">
      <ModelSelector
        models={models}
        selectedModel={selectedModel}
        onModelSelect={onModelSelect}
        isLoading={isModelsLoading}
        onRefresh={onRefreshModels}
      />
      <CategorySelector
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
        onEnhancerUpdate={onEnhancerUpdate}
      />
    </div>
  );
}