import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UseCaseFormField } from "./UseCaseFormField";
import { EnhancerActions } from "../EnhancerActions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateDescription } from "@/utils/descriptionGenerator";

interface UseCaseFormProps {
  onSubmit: (data: { title: string; description: string; enhancer: string }) => Promise<void>;
  initialData?: {
    title: string;
    description: string;
    enhancer: string;
  };
  isSubmitting: boolean;
  useCaseId?: string;
}

export function UseCaseForm({ onSubmit, initialData, isSubmitting, useCaseId }: UseCaseFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [enhancer, setEnhancer] = useState(initialData?.enhancer || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateDescription = async () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Please fill out the title field first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedDescription = await generateDescription(title);
      setDescription(generatedDescription);
      
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
    await onSubmit({ title, description, enhancer });
  };

  return (
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
            disabled={isGenerating || !title}
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
        actions={
          <EnhancerActions 
            currentEnhancer={enhancer} 
            onEnhancerUpdate={setEnhancer}
            useCaseId={useCaseId || ''}
          />
        }
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Use Case"}
      </Button>
    </form>
  );
}
