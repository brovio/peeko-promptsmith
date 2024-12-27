import { Model } from "@/lib/types";
import { ModelCard } from "./ModelCard";

interface ModelsListProps {
  models: Model[];
  onAdd: (model: Model) => void;
  cardStyle?: React.CSSProperties;
}

export function ModelsList({ models, onAdd, cardStyle }: ModelsListProps) {
  if (!models?.length) {
    return <div className="text-center">No models found</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          onAdd={onAdd}
          style={cardStyle}
        />
      ))}
    </div>
  );
}