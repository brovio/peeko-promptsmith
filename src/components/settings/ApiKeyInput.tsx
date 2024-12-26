import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ApiKeyInputProps {
  apiKey: string;
  isValidating: boolean;
  onApiKeyChange: (value: string) => void;
  onValidate: () => void;
}

export function ApiKeyInput({ apiKey, isValidating, onApiKeyChange, onValidate }: ApiKeyInputProps) {
  return (
    <div className="flex gap-4">
      <Input
        type="password"
        placeholder="Enter your API key"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
      />
      <Button 
        onClick={onValidate} 
        disabled={isValidating} 
        className="bg-blue-500 hover:bg-blue-600"
      >
        {isValidating ? "Validating..." : "Validate"}
      </Button>
    </div>
  );
}