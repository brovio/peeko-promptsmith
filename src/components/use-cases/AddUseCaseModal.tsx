import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UseCaseForm } from "./form/UseCaseForm";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddUseCaseModalProps {
  initialData?: {
    title: string;
    description: string;
    enhancer: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddUseCaseModal({ initialData, open, onOpenChange }: AddUseCaseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: { title: string; description: string; enhancer: string }) => {
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("use_cases")
        .insert([{ 
          title: data.title, 
          description: data.description, 
          enhancer: data.enhancer,
          user_id: user.id
        }])
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Use case added successfully",
      });

      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["use-cases"] });
    } catch (error: any) {
      console.error("Error adding use case:", error);
      toast({
        title: "Error",
        description: "Failed to add use case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Use Case</DialogTitle>
          <DialogDescription>
            Add a new use case for prompting. Fill in all the fields below.
          </DialogDescription>
        </DialogHeader>
        <UseCaseForm
          onSubmit={handleSubmit}
          initialData={initialData}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}