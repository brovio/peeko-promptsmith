import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EnhancerActions } from "./EnhancerActions";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate', {
        body: {
          prompt: `Generate a clear and concise description for a use case titled "${title}". The description should explain the purpose and benefits of this use case.`,
        },
      });

      if (error) throw error;
      
      setDescription(data.generatedText || '');
      toast({
        title: "Success",
        description: "Description generated successfully",
      });
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        title: "Error",
        description: "Failed to generate description",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // First, delete all related operations
      const { error: operationsError } = await supabase
        .from("use_case_operations")
        .delete()
        .eq("use_case_id", useCase.id);

      if (operationsError) throw operationsError;

      // Then, delete the use case
      const { error: useCaseError } = await supabase
        .from("use_cases")
        .delete()
        .eq("id", useCase.id);

      if (useCaseError) throw useCaseError;

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

  const handleEnhancerUpdate = async (newEnhancer: string) => {
    setEnhancer(newEnhancer);
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
              className="text-white bg-background"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isGenerating || !title}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
              className="text-white bg-background"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="enhancer">Enhancer</Label>
              <EnhancerActions
                currentEnhancer={enhancer}
                onEnhancerUpdate={handleEnhancerUpdate}
                useCaseId={useCase.id}
              />
            </div>
            <Textarea
              id="enhancer"
              value={enhancer}
              onChange={(e) => setEnhancer(e.target.value)}
              placeholder="Enter enhancer"
              required
              className="min-h-[200px] text-white bg-background"
            />
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isSubmitting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <div className="flex gap-2">
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}