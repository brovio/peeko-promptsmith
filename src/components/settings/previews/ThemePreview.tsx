import { LoginPreview } from "./LoginPreview";
import { ModelCardPreview } from "./ModelCardPreview";
import { UseCasePreview } from "./UseCasePreview";

export function ThemePreview() {
  return (
    <div className="space-y-8 p-6 border rounded-lg bg-background">
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