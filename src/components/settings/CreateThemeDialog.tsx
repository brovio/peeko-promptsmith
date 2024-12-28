import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColorTheme } from "@/lib/colorUtils";

interface CreateThemeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTheme: ColorTheme;
  onGenerateNew: () => void;
  onSave: (name: string) => void;
}

export function CreateThemeDialog({
  isOpen,
  onOpenChange,
  currentTheme,
  onGenerateNew,
  onSave,
}: CreateThemeDialogProps) {
  const [themeName, setThemeName] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Theme</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Theme Name</Label>
            <Input
              placeholder="Enter theme name"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
            />
          </div>
          <div 
            className="p-4 rounded"
            style={{ backgroundColor: currentTheme.background }}
          >
            <div className="space-y-2">
              <div 
                className="p-2 rounded"
                style={{ 
                  backgroundColor: currentTheme.primary,
                  color: currentTheme.foreground 
                }}
              >
                Primary Color
              </div>
              <div 
                className="p-2 rounded"
                style={{ 
                  backgroundColor: currentTheme.secondary,
                  color: currentTheme.foreground 
                }}
              >
                Secondary Color
              </div>
              <div 
                className="p-2 rounded"
                style={{ 
                  backgroundColor: currentTheme.accent,
                  color: currentTheme.foreground 
                }}
              >
                Accent Color
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={onGenerateNew} variant="outline">
              Generate New Colors
            </Button>
            <Button
              onClick={() => onSave(themeName)}
              disabled={!themeName.trim()}
            >
              Save Theme
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}