import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if title already exists
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
        setIsSubmitting(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <Plus className="mr-2 h-4 w-4" />
          Add New Use Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Use Case</DialogTitle>
          <DialogDescription>
            Add a new use case for prompting. Fill in all the fields below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateDescription}
                disabled={isGenerating || (!title && !enhancer)}
                className="h-8 px-2"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="enhancer" className="text-sm font-medium">
              Enhancer
            </label>
            <Textarea
              id="enhancer"
              value={enhancer}
              onChange={(e) => setEnhancer(e.target.value)}
              placeholder="Enter enhancer"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Use Case"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}