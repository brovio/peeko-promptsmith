import { Model } from "@/lib/types";
import { SearchModels } from "@/components/models/SearchModels";
import { ModelsList } from "@/components/models/ModelsList";
import { ColorTheme } from "@/lib/colorUtils";

interface ModelsContainerProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  currentTheme: ColorTheme;
  isLoading: boolean;
  filteredModels: Model[];
  onAdd: (model: Model) => void;
  onRemove: (modelId: string) => void;
  modelsInUse: string[];
}

export function ModelsContainer({
  searchTerm,
  onSearch,
  currentTheme,
  isLoading,
  filteredModels,
  onAdd,
  onRemove,
  modelsInUse
}: ModelsContainerProps) {
  return (
    <div className="space-y-6">
      <SearchModels
        searchTerm={searchTerm}
        onSearch={onSearch}
        currentTheme={currentTheme}
      />

      {isLoading ? (
        <div className="text-center">Loading models...</div>
      ) : (
        <ModelsList
          models={filteredModels}
          onAdd={onAdd}
          onRemove={onRemove}
          modelsInUse={modelsInUse}
          cardStyle={{
            backgroundColor: currentTheme.background,
            color: currentTheme.foreground
          }}
        />
      )}
    </div>
  );
}