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
import { EnhancerActions } from "./EnhancerActions";
import { UseCaseFormField } from "./form/UseCaseFormField";

interface AddUseCaseModalProps {
  initialData?: {
    title: string;
    description: string;
    enhancer: string;
  };
}

export function AddUseCaseModal({ initialData }: AddUseCaseModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [enhancer, setEnhancer] = useState(initialData?.enhancer || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateDescription = async () => {
    if (!title && !enhancer) {
      toast({
        title: "Error",
        description: "Please fill out either the title or enhancer field first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemini/gemini-pro",
          prompt: `Based on the following information about a prompt enhancement use case, generate a clear and concise description (max 200 characters) that explains its purpose and benefits:
          
          Title: ${title || "Not provided"}
          Enhancer: ${enhancer || "Not provided"}
          
          The description should help users understand when and why they would use this prompt enhancement.`
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate description");
      }

      const data = await response.json();
      setDescription(data.generatedText.trim());
      
      toast({
        title: "Success",
        description: "Description generated successfully",
      });
    } catch (error) {
      console.error("Error generating description:", error);
      toast({
        title: "Error",
        description: "Failed to generate description. Please try again.",
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
      const { data: existingUseCases } = await supabase
        .from("use_cases")
        .select("id")
        .eq("title", title)
        .single();

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
          title, 
          description, 
          enhancer,
          user_id: user.id
        }])
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Use case added successfully",
      });

      setTitle("");
      setDescription("");
      setEnhancer("");
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <UseCaseFormField
            id="title"
            label="Title"
            type="input"
            value={title}
            onChange={setTitle}
            placeholder="Enter title"
            required
            hint="title"
          />

          <UseCaseFormField
            id="description"
            label="Description"
            type="textarea"
            value={description}
            onChange={setDescription}
            placeholder="Enter description"
            required
            hint="description"
            className="min-h-[100px]"
            actions={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateDescription}
                disabled={isGenerating || (!title && !enhancer)}
                className="h-8 px-2"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            }
          />

          <UseCaseFormField
            id="enhancer"
            label="Enhancer"
            type="textarea"
            value={enhancer}
            onChange={setEnhancer}
            placeholder="Enter enhancer"
            required
            hint="enhancer"
            className="min-h-[150px]"
            actions={<EnhancerActions currentEnhancer={enhancer} onEnhancerUpdate={setEnhancer} />}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Use Case"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}