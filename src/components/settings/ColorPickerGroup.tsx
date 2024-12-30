import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { rgbToHsl } from "@/lib/colorUtils";

interface ColorPickerGroupProps {
  label: string;
  description: string;
  mainColor: string;
  foregroundColor: string;
  onMainColorChange: (value: string) => void;
  onForegroundColorChange: (value: string) => void;
  previewClassName?: string;
  inputTextColor?: string;
  onInputTextColorChange?: (value: string) => void;
}

export function ColorPickerGroup({
  label,
  description,
  mainColor,
  foregroundColor,
  onMainColorChange,
  onForegroundColorChange,
  previewClassName = "bg-background text-foreground",
  inputTextColor,
  onInputTextColorChange,
}: ColorPickerGroupProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{label}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="space-x-2">
          <Button 
            variant="secondary"
            className={`${previewClassName} transition-colors duration-200`}
          >
            Preview Text
          </Button>
          {inputTextColor && (
            <Input
              type="text"
              placeholder="Type here..."
              className={`w-32 ${previewClassName}`}
              style={{ color: `hsl(${inputTextColor})` }}
            />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Main Color (HSL)</Label>
          <Input
            type="text"
            value={mainColor}
            onChange={(e) => onMainColorChange(e.target.value)}
            placeholder="0 0% 100%"
          />
          <Input
            type="color"
            value={`hsl(${mainColor})`}
            onChange={(e) => {
              const color = e.target.value;
              const r = parseInt(color.substr(1,2), 16);
              const g = parseInt(color.substr(3,2), 16);
              const b = parseInt(color.substr(5,2), 16);
              const hsl = rgbToHsl(r, g, b);
              onMainColorChange(`${hsl[0]} ${hsl[1]}% ${hsl[2]}%`);
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Foreground Color (HSL)</Label>
          <Input
            type="text"
            value={foregroundColor}
            onChange={(e) => onForegroundColorChange(e.target.value)}
            placeholder="0 0% 0%"
          />
          <Input
            type="color"
            value={`hsl(${foregroundColor})`}
            onChange={(e) => {
              const color = e.target.value;
              const r = parseInt(color.substr(1,2), 16);
              const g = parseInt(color.substr(3,2), 16);
              const b = parseInt(color.substr(5,2), 16);
              const hsl = rgbToHsl(r, g, b);
              onForegroundColorChange(`${hsl[0]} ${hsl[1]}% ${hsl[2]}%`);
            }}
          />
        </div>

        {inputTextColor && onInputTextColorChange && (
          <div className="space-y-2 col-span-2">
            <Label>Input Text Color (HSL)</Label>
            <Input
              type="text"
              value={inputTextColor}
              onChange={(e) => onInputTextColorChange(e.target.value)}
              placeholder="0 0% 0%"
            />
            <Input
              type="color"
              value={`hsl(${inputTextColor})`}
              onChange={(e) => {
                const color = e.target.value;
                const r = parseInt(color.substr(1,2), 16);
                const g = parseInt(color.substr(3,2), 16);
                const b = parseInt(color.substr(5,2), 16);
                const hsl = rgbToHsl(r, g, b);
                onInputTextColorChange(`${hsl[0]} ${hsl[1]}% ${hsl[2]}%`);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}