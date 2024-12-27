import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchModels } from "@/lib/openrouter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FilterSheet } from "@/components/models/FilterSheet";
import { ModelCard } from "@/components/models/ModelCard";
import { Model } from "@/lib/types";

export default function Models() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [contextLength, setContextLength] = useState([0]);
  const { toast } = useToast();

  // Fetch API key from Supabase
  const { data: apiKeyData } = useQuery({
    queryKey: ['apiKey'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: apiKeyData } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('user_id', user.id)
        .eq('provider', 'openrouter')
        .eq('is_active', true)
        .single();

      return apiKeyData;
    },
  });

  // Fetch models from OpenRouter
  const { data: models, isLoading } = useQuery({
    queryKey: ['models', apiKeyData?.key_value],
    queryFn: async () => {
      if (!apiKeyData?.key_value) return [];
      return fetchModels(apiKeyData.key_value);
    },
    enabled: !!apiKeyData?.key_value,
  });

  // Get unique providers
  const providers = [...new Set(models?.map(model => model.id.split('/')[0]) || [])];

  // Get max context length
  const maxContextLength = Math.max(...(models?.map(model => model.context_length || 0) || [0]));

  // Filter models based on search term and filters
  const filteredModels = models?.filter(model => {
    const matchesSearch = 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvider = 
      selectedProvider === "all" || 
      model.id.split('/')[0] === selectedProvider;
    
    const matchesContext = 
      !contextLength[0] || 
      (model.context_length || 0) >= contextLength[0];

    return matchesSearch && matchesProvider && matchesContext;
  }) || [];

  const addModel = async (model: Model) => {
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
    } catch (error) {
      console.error('Error adding model:', error);
      toast({
        title: "Error",
        description: "Failed to add model",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Models</h1>
        <FilterSheet
          providers={providers}
          maxContextLength={maxContextLength}
          selectedProvider={selectedProvider}
          contextLength={contextLength}
          onProviderChange={setSelectedProvider}
          onContextLengthChange={setContextLength}
        />
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="text-center">Loading models...</div>
        ) : !apiKeyData?.key_value ? (
          <div className="text-center">
            Please add your OpenRouter API key in settings to view available models.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onAdd={addModel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}