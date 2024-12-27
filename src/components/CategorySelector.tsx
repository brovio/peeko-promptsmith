import { Category } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultCategories: Category[] = [
  {
    id: "general",
    name: "General Purpose",
    description: "For any type of prompt",
    template: "Please provide a detailed and well-structured response to the following: {prompt}",
  },
];

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export function CategorySelector({ selectedCategory, onCategorySelect }: CategorySelectorProps) {
  return (
    <div className="w-full max-w-xs">
      <Select value={selectedCategory} onValueChange={onCategorySelect}>
        <SelectTrigger>
          <SelectValue placeholder="Choose Mode" />
        </SelectTrigger>
        <SelectContent>
          {defaultCategories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function getTemplateForCategory(categoryId: string): string {
  const category = defaultCategories.find((c) => c.id === categoryId);
  return category?.template || "{prompt}";
}