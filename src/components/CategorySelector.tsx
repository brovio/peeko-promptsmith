import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface UseCaseProps {
  id: string;
  title: string;
  description: string;
  enhancer: string;
}

interface CategorySelectorProps {
  onCategorySelect: (categoryId: string) => void;
  onEnhancerUpdate: (enhancer: string) => void;
  selectedCategory: string;
}

export function CategorySelector({ 
  onCategorySelect, 
  onEnhancerUpdate,
  selectedCategory 
}: CategorySelectorProps) {
  const { data: useCases, isLoading, error } = useQuery({
    queryKey: ['use-cases'],
    queryFn: async () => {
      console.log('Fetching use cases...');
      const { data, error } = await supabase
        .from('use_cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching use cases:', error);
        throw error;
      }

      console.log('Found', data?.length, 'use cases');
      return data as UseCaseProps[];
    },
    retry: 1,
    retryDelay: 1000,
    initialData: [], // Show empty array initially
  });

  const handleUseCaseSelect = (useCaseId: string) => {
    const selectedUseCase = useCases?.find(uc => uc.id === useCaseId);
    if (selectedUseCase) {
      onCategorySelect(useCaseId);
      onEnhancerUpdate(selectedUseCase.enhancer);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (error) {
    console.error('Error in CategorySelector:', error);
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Error loading categories" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedCategory} onValueChange={handleUseCaseSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {useCases?.map((useCase) => (
          <SelectItem key={useCase.id} value={useCase.id}>
            {useCase.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}