import { ModelAndCategorySelectors } from "./ModelAndCategorySelectors";
import { PromptSection } from "./PromptSection";
import { ResultSection } from "./ResultSection";
import { Model } from "@/lib/types";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onRefreshModels: () => void;
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
  onRefreshModels,
}: MainContentProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-screen-2xl mx-auto px-4">
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

      <div className="relative">
        <ResultSection result={result} metadata={metadata} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="absolute top-2 right-2">
                <Info className={`h-6 w-6 transition-colors ${result ? 'text-[hsl(142,76%,36%)]' : 'text-muted-foreground'}`} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{result ? 'View result details' : 'No results yet'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}