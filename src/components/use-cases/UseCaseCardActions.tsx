import { Button } from "@/components/ui/button";
import { Edit, Play, Info, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UseCaseCardActionsProps {
  onEdit: () => void;
  onUse: () => void;
  onInfo: () => void;
  onDuplicate: () => void;
}

export function UseCaseCardActions({ onEdit, onUse, onInfo, onDuplicate }: UseCaseCardActionsProps) {
  return (
    <div className="flex gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:text-primary" 
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 dark:text-[hsl(142,76%,36%)] black:text-[hsl(142,76%,36%)]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit use case</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:text-primary" 
              onClick={onUse}
            >
              <Play className="h-4 w-4 dark:text-[hsl(142,76%,36%)] black:text-[hsl(142,76%,36%)]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Use this template</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:text-primary" 
              onClick={onInfo}
            >
              <Info className="h-4 w-4 dark:text-[hsl(142,76%,36%)] black:text-[hsl(142,76%,36%)]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View details</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:text-primary" 
              onClick={onDuplicate}
            >
              <Copy className="h-4 w-4 dark:text-[hsl(142,76%,36%)] black:text-[hsl(142,76%,36%)]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Duplicate use case</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}