import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { rgbToHsl } from "@/lib/colorUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

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
  tooltipContent?: string;
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
  tooltipContent,
}: ColorPickerGroupProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{label}</h3>
            {tooltipContent && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{tooltipContent}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="space-x-2">
          <div 
            className={`${previewClassName} p-2 rounded-md border`}
            style={{
              backgroundColor: `hsl(${mainColor})`,
              color: `hsl(${foregroundColor})`
            }}
          >
            Style Example
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Main Color (HSL)</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={mainColor}
              onChange={(e) => onMainColorChange(e.target.value)}
              placeholder="0 0% 100%"
              className="flex-1"
            />
            <div 
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: `hsl(${mainColor})` }}
            />
          </div>
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
            className="h-10"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Foreground Color (HSL)</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={foregroundColor}
              onChange={(e) => onForegroundColorChange(e.target.value)}
              placeholder="0 0% 0%"
              className="flex-1"
            />
            <div 
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: `hsl(${foregroundColor})` }}
            />
          </div>
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
            className="h-10"
          />
        </div>

        {inputTextColor && onInputTextColorChange && (
          <div className="space-y-2 col-span-2">
            <Label>Input Text Color (HSL)</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputTextColor}
                onChange={(e) => onInputTextColorChange(e.target.value)}
                placeholder="0 0% 0%"
                className="flex-1"
              />
              <div 
                className="w-10 h-10 rounded border"
                style={{ backgroundColor: `hsl(${inputTextColor})` }}
              />
            </div>
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
              className="h-10"
            />
          </div>
        )}
      </div>
    </div>
  );
}