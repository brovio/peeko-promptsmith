import { Input } from "@/components/ui/input";

interface BaseColorPreviewProps {
  background: string;
  foreground: string;
  inputText: string;
}

export function BaseColorPreview({ background, foreground, inputText }: BaseColorPreviewProps) {
  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Base Color Examples</h3>
      
      {/* Background & Text Example */}
      <div 
        className="p-6 rounded-lg border"
        style={{ 
          backgroundColor: `hsl(${background})`,
          color: `hsl(${foreground})`
        }}
      >
        <h4 className="text-xl font-semibold mb-2">Background & Text Colors</h4>
        <p className="mb-4">This example shows how your main background and text colors work together.</p>
        <div className="space-y-2">
          <p>• Main heading example</p>
          <p>• Regular text example</p>
          <p className="text-sm">• Smaller text example</p>
        </div>
      </div>

      {/* Input Text Example */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Input Text Example</h4>
        <Input 
          placeholder="Input field example"
          className="w-full"
          style={{ color: `hsl(${inputText})` }}
        />
      </div>
    </div>
  );
}