import { ErrorDisplay } from "@/components/models/ErrorDisplay";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Model } from "@/lib/types";

interface ModelsErrorBoundaryProps {
  modelsError: Error | null;
  selectedModelsError: Error | null;
  refetchModels: (options?: RefetchOptions) => Promise<QueryObserverResult<Model[], Error>>;
  refetchSelectedModels: (options?: RefetchOptions) => Promise<QueryObserverResult<Model[], Error>>;
}

export function ModelsErrorBoundary({
  modelsError,
  selectedModelsError,
  refetchModels,
  refetchSelectedModels
}: ModelsErrorBoundaryProps) {
  if (modelsError) {
    return <ErrorDisplay error={modelsError} onRetry={refetchModels} />;
  }

  if (selectedModelsError) {
    return <ErrorDisplay error={selectedModelsError} onRetry={refetchSelectedModels} />;
  }

  return null;
}