import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { EnhancerActions } from "../EnhancerActions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EditUseCaseFormProps {
  useCase: {
    id: string;
    title: string;
    description: string;
    enhancer: string;
  };
  onSubmit: (data: { title: string; description: string; enhancer: string }) => Promise<void>;
  isSubmitting: boolean;
}

export function EditUseCaseForm({ useCase, onSubmit, isSubmitting }: EditUseCaseFormProps) {
  const [title, setTitle] = useState(useCase.title);
  const [description, setDescription] = useState(useCase.description);
  const [enhancer, setEnhancer] = useState(useCase.enhancer);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateDescription = async () => {
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
      const { data, error } = await supabase.functions.invoke('generate', {
        body: {
          prompt: `Generate a clear and concise description (max 200 characters) for a use case titled "${title}". Focus on the purpose and benefits, avoiding technical details already mentioned in the title. The description should be direct and brief.`,
        },
      });

      if (error) throw error;
      
      setDescription(data.generatedText.trim());
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
    await onSubmit({ title, description, enhancer });
  };

  return (
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
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={isGenerating || !title}
            className="text-sm text-blue-500 hover:text-blue-400 disabled:text-gray-400"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
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
            onEnhancerUpdate={setEnhancer}
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
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}