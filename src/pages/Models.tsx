import { useState } from "react";
import { generateColorTheme } from "@/lib/colorUtils";
import { ModelsList } from "@/components/models/ModelsList";
import { SelectedModels } from "@/components/models/SelectedModels";
import { SearchModels } from "@/components/models/SearchModels";
import { ModelsHeader } from "@/components/models/ModelsHeader";
import { useToast } from "@/hooks/use-toast";
import { filterModels } from "@/lib/modelUtils";
import { ErrorDisplay } from "@/components/models/ErrorDisplay";
import { useModelsData } from "@/components/models/useModelsData";
import { ModelOperations } from "@/components/models/ModelOperations";

export default function Models() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [contextLength, setContextLength] = useState([0]);
  const [currentTheme, setCurrentTheme] = useState(generateColorTheme());
  const [isThemeLocked, setIsThemeLocked] = useState(false);
  const { toast } = useToast();

  const {
    models,
    selectedModels,
    isLoading,
    modelsError,
    selectedModelsError,
    refetchModels,
    refetchSelectedModels
  } = useModelsData();

  const { handleAddModel, handleRemoveModel } = ModelOperations({
    onSuccess: refetchSelectedModels
  });

  const providers: string[] = Array.from(
    new Set((models || []).map((model) => model.provider))
  );

  const maxContextLength = Math.max(
    ...(models?.map((model) => model.context_length || 0) || [0])
  );

  const generateNewTheme = () => {
    if (!isThemeLocked) {
      setCurrentTheme(generateColorTheme());
    }
  };

  const lockCurrentTheme = () => {
    setIsThemeLocked(true);
    toast({
      title: "Theme Locked! 🎨",
      description: "This color combination has been saved as your preference."
    });
  };

  const themeStyle = {
    backgroundColor: currentTheme.background,
    color: currentTheme.foreground
  };

  const filteredModels = filterModels(models, searchTerm, selectedProvider, contextLength);

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={themeStyle}
    >
      <div className="container mx-auto py-8 px-4">
        <ModelsHeader
          providers={providers}
          maxContextLength={maxContextLength}
          selectedProvider={selectedProvider}
          contextLength={contextLength}
          currentTheme={currentTheme}
          isThemeLocked={isThemeLocked}
          onProviderChange={setSelectedProvider}
          onContextLengthChange={setContextLength}
          onGenerateNewTheme={generateNewTheme}
          onLockTheme={lockCurrentTheme}
        />

        {modelsError && (
          <ErrorDisplay 
            error={modelsError} 
            onRetry={refetchModels}
          />
        )}

        {selectedModelsError && (
          <ErrorDisplay 
            error={selectedModelsError} 
            onRetry={refetchSelectedModels}
          />
        )}

        <SelectedModels 
          models={selectedModels}
          onRemove={handleRemoveModel}
        />

        <div className="space-y-6">
          <SearchModels
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            currentTheme={currentTheme}
          />

          {isLoading ? (
            <div className="text-center">Loading models...</div>
          ) : (
            <ModelsList
              models={filteredModels}
              onAdd={handleAddModel}
              cardStyle={themeStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
}