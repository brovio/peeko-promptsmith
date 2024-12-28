import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UseCaseForm } from "./form/UseCaseForm";

interface AddUseCaseModalProps {
  initialData?: {
    title: string;
    description: string;
    enhancer: string;
  };
}

export function AddUseCaseModal({ initialData }: AddUseCaseModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: { title: string; description: string; enhancer: string }) => {
    setIsSubmitting(true);

    try {
      const { data: existingUseCases, error: checkError } = await supabase
        .from("use_cases")
        .select("id")
        .eq("title", data.title)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUseCases) {
        toast({
          title: "Error",
          description: "A use case with this title already exists. Please choose a different title.",
          variant: "destructive",
        });
        return;
      }

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

      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <Plus className="mr-2 h-4 w-4" />
          Add New Use Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] bg-background">
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