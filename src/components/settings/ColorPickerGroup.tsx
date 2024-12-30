import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rgbToHsl } from "@/lib/colorUtils";

interface ColorPickerGroupProps {
  label: string;
  description: string;
  mainColor: string;
  foregroundColor: string;
  onMainColorChange: (value: string) => void;
  onForegroundColorChange: (value: string) => void;
  previewClassName?: string;
}

export function ColorPickerGroup({
  label,
  description,
  mainColor,
  foregroundColor,
  onMainColorChange,
  onForegroundColorChange,
  previewClassName = "bg-background text-foreground"
}: ColorPickerGroupProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{label}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className={`${previewClassName} p-2 rounded border`}>
          Preview Text
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
      </div>
    </div>
  );
}