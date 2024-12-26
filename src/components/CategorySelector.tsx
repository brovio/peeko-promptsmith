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
  {
    id: "coding",
    name: "Coding",
    description: "For programming related prompts",
    template: "You are an expert programmer. Please help with the following coding task, providing clear explanations and examples: {prompt}",
  },
  {
    id: "email",
    name: "Email Responses",
    description: "For crafting professional emails",
    template: "Please help me write a professional email response for the following context: {prompt}",
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
          <SelectValue placeholder="Select a category" />
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