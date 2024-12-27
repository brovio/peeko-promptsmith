import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchModels } from "@/lib/openrouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function Models() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("");
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
      !selectedProvider || 
      model.id.split('/')[0] === selectedProvider;
    
    const matchesContext = 
      !contextLength[0] || 
      (model.context_length || 0) >= contextLength[0];

    return matchesSearch && matchesProvider && matchesContext;
  }) || [];

  const addModel = async (model: any) => {
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
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Models</SheetTitle>
              <SheetDescription>
                Customize your model view with these filters
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select
                  value={selectedProvider}
                  onValueChange={setSelectedProvider}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All providers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All providers</SelectItem>
                    {providers.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Minimum Context Length</Label>
                <Slider
                  value={contextLength}
                  onValueChange={setContextLength}
                  max={maxContextLength}
                  step={1000}
                />
                <div className="text-sm text-muted-foreground">
                  {contextLength[0].toLocaleString()} tokens
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
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
              <div
                key={model.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{model.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => addModel(model)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                <div className="text-xs text-gray-500">
                  <p>Provider: {model.id.split('/')[0]}</p>
                  {model.context_length && (
                    <p>Context Length: {model.context_length.toLocaleString()}</p>
                  )}
                  {model.pricing && (
                    <div>
                      <p>Prompt: ${model.pricing.prompt}/1K tokens</p>
                      <p>Completion: ${model.pricing.completion}/1K tokens</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}