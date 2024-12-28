import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingModalProps {
  open: boolean;
  currentModel: string;
  attemptCount: number;
  title?: string;
  description?: string;
}

export function LoadingModal({ 
  open, 
  currentModel, 
  attemptCount,
  title = "Enhancing your prompt...",
  description
}: LoadingModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <h3 className="font-semibold">{title}</h3>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Attempt {attemptCount} - Trying with model:
                </p>
                <p className="text-sm font-medium">{currentModel}</p>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}