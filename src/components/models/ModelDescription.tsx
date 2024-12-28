import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ModelDescriptionProps {
  description: string | null;
}

export function ModelDescription({ description }: ModelDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateText = (text: string, charLimit: number) => {
    if (!text) return "";
    if (text.length <= charLimit) return text;
    return `${text.substring(0, charLimit)}...`;
  };

  if (!description) return null;

  return (
    <div>
      <CardDescription className="text-left mt-2">
        {isExpanded ? description : truncateText(description, 180)}
      </CardDescription>
      {description.length > 180 && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 h-6 px-0 text-muted-foreground hover:text-foreground"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <div className="flex items-center gap-1">
              Show less <ChevronUp className="h-3 w-3" />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              Read more <ChevronDown className="h-3 w-3" />
            </div>
          )}
        </Button>
      )}
    </div>
  );
}