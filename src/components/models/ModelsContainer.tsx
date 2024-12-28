import { Model } from "@/lib/types";
import { SearchModels } from "@/components/models/SearchModels";
import { ModelsList } from "@/components/models/ModelsList";
import { useState } from "react";

interface ModelsContainerProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  isLoading: boolean;
  filteredModels: Model[];
  onAdd: (model: Model) => void;
  onRemove: (modelId: string) => void;
  modelsInUse: string[];
}

export function ModelsContainer({
  searchTerm,
  onSearch,
  isLoading,
  filteredModels,
  onAdd,
  onRemove,
  modelsInUse
}: ModelsContainerProps) {
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [isPaid, setIsPaid] = useState<boolean | null>(null);

  // Get unique providers from filtered models
  const providers = Array.from(
    new Set(filteredModels.map((model) => model.provider))
  );

  // Apply additional filters
  const finalFilteredModels = filteredModels.filter(model => {
    const matchesProvider = selectedProvider === "all" || model.provider === selectedProvider;
    const matchesPrice = isPaid === null || 
      (isPaid ? (model.input_price > 0 || model.output_price > 0) : 
                ((!model.input_price || model.input_price === 0) && (!model.output_price || model.output_price === 0)));
    
    return matchesProvider && matchesPrice;
  });

  return (
    <div className="space-y-6">
      <SearchModels
        searchTerm={searchTerm}
        onSearch={onSearch}
        providers={providers}
        selectedProvider={selectedProvider}
        onProviderChange={setSelectedProvider}
        isPaid={isPaid}
        onPriceFilterChange={setIsPaid}
      />

      {isLoading ? (
        <div className="text-center">Loading models...</div>
      ) : (
        <ModelsList
          models={finalFilteredModels}
          onAdd={onAdd}
          onRemove={onRemove}
          modelsInUse={modelsInUse}
        />
      )}
    </div>
  );
}