import { Button } from "@/components/ui/button";
import { Unlink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ValidatedKeyActionsProps {
  onUnlink: () => void;
}

export function ValidatedKeyActions({ onUnlink }: ValidatedKeyActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="text-primary border-primary">
        Validated
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={onUnlink} className="text-destructive">
              <Unlink className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Unlink API Key</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}