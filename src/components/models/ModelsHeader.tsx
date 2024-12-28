import { FilterSheet } from "./FilterSheet";

interface ModelsHeaderProps {
  providers: string[];
  maxContextLength: number;
  selectedProvider: string;
  contextLength: number[];
  onProviderChange: (provider: string) => void;
  onContextLengthChange: (length: number[]) => void;
}

export function ModelsHeader({
  providers,
  maxContextLength,
  selectedProvider,
  contextLength,
  onProviderChange,
  onContextLengthChange,
}: ModelsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Available Models</h1>
      <FilterSheet
        providers={providers}
        maxContextLength={maxContextLength}
        selectedProvider={selectedProvider}
        contextLength={contextLength}
        onProviderChange={onProviderChange}
        onContextLengthChange={onContextLengthChange}
      />
    </div>
  );
}