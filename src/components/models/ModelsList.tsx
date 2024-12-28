import { Model } from "@/lib/types";
import { ModelCard } from "./ModelCard";

interface ModelsListProps {
  models: Model[];
  onAdd: (model: Model) => void;
  onRemove?: (modelId: string) => void;
  modelsInUse?: string[];
  cardStyle?: React.CSSProperties;
}

export function ModelsList({ models, onAdd, onRemove, modelsInUse = [], cardStyle }: ModelsListProps) {
  if (!models?.length) {
    return <div className="text-center">No models found</div>;
  }

  // Sort models to show selected ones at the top
  const sortedModels = [...models].sort((a, b) => {
    const aInUse = modelsInUse.includes(a.id);
    const bInUse = modelsInUse.includes(b.id);
    if (aInUse && !bInUse) return -1;
    if (!aInUse && bInUse) return 1;
    return 0;
  });

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {sortedModels.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          onAdd={onAdd}
          onRemove={onRemove}
          isInUse={modelsInUse.includes(model.id)}
          style={cardStyle}
        />
      ))}
    </div>
  );
}