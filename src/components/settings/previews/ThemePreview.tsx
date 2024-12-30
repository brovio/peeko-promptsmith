import { LoginPreview } from "./LoginPreview";
import { ModelCardPreview } from "./ModelCardPreview";
import { UseCasePreview } from "./UseCasePreview";
import { FormPreview } from "./FormPreview";

interface ThemePreviewProps {
  showAllExamples?: boolean;
}

export function ThemePreview({ showAllExamples = false }: ThemePreviewProps) {
  return (
    <div className="space-y-8 p-6 border rounded-lg bg-background">
      <FormPreview showAllExamples={showAllExamples} />
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Login Form</h3>
        <LoginPreview />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Model Card</h3>
        <div className="max-w-md">
          <ModelCardPreview />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Use Case Card</h3>
        <div className="max-w-md">
          <UseCasePreview />
        </div>
      </div>
    </div>
  );
}