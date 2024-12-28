import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export interface UseCase {
  id: string;
  title: string;
  enhancer: string;
}

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onEnhancerUpdate: (enhancer: string) => void;
}

export function CategorySelector({ 
  selectedCategory, 
  onCategorySelect,
  onEnhancerUpdate 
}: CategorySelectorProps) {
  const { data: useCases, isLoading } = useQuery({
    queryKey: ['use-cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('use_cases')
        .select('id, title, enhancer');
      
      if (error) throw error;
      return data as UseCase[];
    }
  });

  const handleUseCaseSelect = (useCaseId: string) => {
    const selectedUseCase = useCases?.find(uc => uc.id === useCaseId);
    if (selectedUseCase) {
      onCategorySelect(useCaseId);
      onEnhancerUpdate(selectedUseCase.enhancer);
    }
  };

  return (
    <div className="w-full">
      <Select value={selectedCategory} onValueChange={handleUseCaseSelect}>
        <SelectTrigger className="w-full bg-background text-foreground border-input">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading use cases...</span>
            </div>
          ) : (
            <SelectValue placeholder="Choose Use Case" />
          )}
        </SelectTrigger>
        <SelectContent className="bg-background border-input">
          {useCases?.map((useCase) => (
            <SelectItem 
              key={useCase.id} 
              value={useCase.id}
              className="text-foreground hover:bg-muted"
            >
              {useCase.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function getTemplateForCategory(categoryId: string, enhancer: string): string {
  return enhancer || "{prompt}";
}