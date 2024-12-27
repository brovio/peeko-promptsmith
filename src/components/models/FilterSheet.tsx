import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterSheetProps {
  providers: string[];
  maxContextLength: number;
  selectedProvider: string;
  contextLength: number[];
  onProviderChange: (value: string) => void;
  onContextLengthChange: (value: number[]) => void;
}

export function FilterSheet({
  providers,
  maxContextLength,
  selectedProvider,
  contextLength,
  onProviderChange,
  onContextLengthChange,
}: FilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Models</SheetTitle>
          <SheetDescription>
            Customize your model view with these filters
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select
              value={selectedProvider}
              onValueChange={onProviderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="All providers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All providers</SelectItem>
                {providers.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Minimum Context Length</Label>
            <Slider
              value={contextLength}
              onValueChange={onContextLengthChange}
              max={maxContextLength}
              step={1000}
            />
            <div className="text-sm text-muted-foreground">
              {contextLength[0].toLocaleString()} tokens
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}