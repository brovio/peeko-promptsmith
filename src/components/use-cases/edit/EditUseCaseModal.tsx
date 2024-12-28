import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EditUseCaseForm } from "./EditUseCaseForm";

interface EditUseCaseModalProps {
  useCase: {
    id: string;
    title: string;
    description: string;
    enhancer: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUseCaseModal({ useCase, open, onOpenChange }: EditUseCaseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (data: { title: string; description: string; enhancer: string }) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("use_cases")
        .update({ 
          title: data.title, 
          description: data.description, 
          enhancer: data.enhancer 
        })
        .eq("id", useCase.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["use-cases"] });
      toast({
        title: "Success",
        description: "Use case updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating use case:", error);
      toast({
        title: "Error",
        description: "Failed to update use case",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("use_cases")
        .delete()
        .eq("id", useCase.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["use-cases"] });
      toast({
        title: "Success",
        description: "Use case deleted successfully",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting use case:", error);
      toast({
        title: "Error",
        description: "Failed to delete use case",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Use Case</DialogTitle>
          <DialogDescription>
            Make changes to your use case here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <EditUseCaseForm
            useCase={useCase}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
          
          <div className="flex justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}