import { Model } from "./types";

export const filterModels = (
  models: Model[] | undefined,
  searchTerm: string,
  selectedProvider: string,
  contextLength: number[]
): Model[] => {
  if (!models) return [];
  
  return models.filter(model => {
    const matchesSearch = 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvider = 
      selectedProvider === "all" || 
      model.provider === selectedProvider;
    
    const matchesContext = 
      !contextLength[0] || 
      (model.context_length || 0) >= contextLength[0];

    return matchesSearch && matchesProvider && matchesContext;
  });
};