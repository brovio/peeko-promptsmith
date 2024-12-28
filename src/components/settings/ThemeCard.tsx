import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ThemeCardProps {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
  };
  onDelete: (id: string) => void;
  onApply: () => void;
}

export function ThemeCard({ id, name, colors, onDelete, onApply }: ThemeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Custom Theme</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className="p-4 rounded space-y-2 mb-4"
          style={{ backgroundColor: colors.background }}
        >
          <div 
            className="p-2 rounded"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.foreground 
            }}
          >
            Primary Color
          </div>
          <div 
            className="p-2 rounded"
            style={{ 
              backgroundColor: colors.secondary,
              color: colors.foreground 
            }}
          >
            Secondary Color
          </div>
          <div 
            className="p-2 rounded"
            style={{ 
              backgroundColor: colors.accent,
              color: colors.foreground 
            }}
          >
            Accent Color
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="default"
            onClick={onApply}
            className="flex-1"
          >
            Apply Theme
          </Button>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}