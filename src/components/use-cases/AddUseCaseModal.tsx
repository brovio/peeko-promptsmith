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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AddUseCaseModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [enhancer, setEnhancer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the current user's ID
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
          user_id: user.id // Add the user_id to the insert
        }])
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Use case added successfully",
      });

      // Reset form and close modal
      setTitle("");
      setDescription("");
      setEnhancer("");
      setOpen(false);

      // Invalidate and refetch use cases
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
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
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