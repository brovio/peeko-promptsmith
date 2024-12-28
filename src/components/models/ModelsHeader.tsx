import { FilterSheet } from "./FilterSheet";
import { ThemeActions } from "./ThemeActions";
import { ColorTheme } from "@/lib/colorUtils";

interface ModelsHeaderProps {
  providers: string[];
  maxContextLength: number;
  selectedProvider: string;
  contextLength: number[];
  currentTheme: ColorTheme;
  isThemeLocked: boolean;
  onProviderChange: (provider: string) => void;
  onContextLengthChange: (length: number[]) => void;
  onGenerateNewTheme: () => void;
  onLockTheme: () => void;
}

export function ModelsHeader({
  providers,
  maxContextLength,
  selectedProvider,
  contextLength,
  currentTheme,
  isThemeLocked,
  onProviderChange,
  onContextLengthChange,
  onGenerateNewTheme,
  onLockTheme,
}: ModelsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Available Models</h1>
      <div className="flex gap-2">
        <ThemeActions
          currentTheme={currentTheme}
          isThemeLocked={isThemeLocked}
          onGenerateNewTheme={onGenerateNewTheme}
          onLockTheme={onLockTheme}
        />
        <FilterSheet
          providers={providers}
          maxContextLength={maxContextLength}
          selectedProvider={selectedProvider}
          contextLength={contextLength}
          onProviderChange={onProviderChange}
          onContextLengthChange={onContextLengthChange}
        />
      </div>
    </div>
  );
}