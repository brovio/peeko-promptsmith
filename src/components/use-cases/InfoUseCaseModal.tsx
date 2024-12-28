import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InfoUseCaseModalProps {
  useCase: {
    title: string;
    enhancer: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InfoUseCaseModal({ useCase, open, onOpenChange }: InfoUseCaseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{useCase.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="whitespace-pre-wrap">{useCase.enhancer}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}