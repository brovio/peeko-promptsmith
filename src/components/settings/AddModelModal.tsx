import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Model } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddModelModalProps {
  onModelAdded: () => void;
}

export function AddModelModal({ onModelAdded }: AddModelModalProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const { toast } = useToast();
  const [models, setModels] = useState<Model[]>([]);

  const handleAddModel = async (model: Model) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const [provider] = model.id.split('/');
      
      const { error } = await supabase
        .from('available_models')
        .upsert({
          model_id: model.id,
          name: model.name || model.id,
          provider: provider,
          description: model.description || '',
          context_length: model.context_length,
          is_active: true
        }, {
          onConflict: 'model_id'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Model ${model.name} added successfully`,
      });
      
      onModelAdded();
      setOpen(false);
    } catch (error) {
      console.error('Error adding model:', error);
      toast({
        title: "Error",
        description: "Failed to add model",
        variant: "destructive",
      });
    }
  };

  const filteredModels = models.filter(model => {
    const matchesSearch = (
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesProvider = !providerFilter || model.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  const uniqueProviders = Array.from(new Set(models.map(model => model.provider)));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Model</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Providers</option>
              {uniqueProviders.map(provider => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
              >
                <div>
                  <h3 className="font-medium">{model.name}</h3>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                  <p className="text-sm text-muted-foreground">Provider: {model.provider}</p>
                </div>
                <Button onClick={() => handleAddModel(model)}>Add</Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}