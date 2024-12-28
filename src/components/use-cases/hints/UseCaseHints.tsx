import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface UseCaseHintsProps {
  field: "title" | "description" | "enhancer";
}

export function UseCaseHints({ field }: UseCaseHintsProps) {
  const hints = {
    title: {
      title: "Title Tips",
      description: "Keep it short and descriptive. Use action words that indicate the purpose of the enhancement.",
    },
    description: {
      title: "Description Tips",
      description: "Explain when and why to use this enhancement. Focus on the benefits and use cases.",
    },
    enhancer: {
      title: "Enhancer Tips",
      description: "Write clear instructions for the AI. Include specific steps or criteria for enhancing the prompt.",
    },
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">{hints[field].title}</h4>
          <p className="text-sm text-muted-foreground">
            {hints[field].description}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}