import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [title, setTitle] = useState(useCase.title);
  const [description, setDescription] = useState(useCase.description);
  const [enhancer, setEnhancer] = useState(useCase.enhancer);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("use_cases")
        .update({ title, description, enhancer })
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Use Case</DialogTitle>
          <DialogDescription>
            Make changes to your use case here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enhancer">Enhancer</Label>
            <Textarea
              id="enhancer"
              value={enhancer}
              onChange={(e) => setEnhancer(e.target.value)}
              placeholder="Enter enhancer"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}