import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ColorTheme } from "@/lib/colorUtils";

interface SearchModelsProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  currentTheme: ColorTheme;
}

export function SearchModels({ searchTerm, onSearch, currentTheme }: SearchModelsProps) {
  return (
    <div className="relative">
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2" 
        style={{ color: currentTheme.foreground }} 
      />
      <Input
        type="search"
        placeholder="Search models..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10"
        style={{
          backgroundColor: currentTheme.secondary,
          color: currentTheme.foreground,
          borderColor: currentTheme.accent,
        }}
      />
    </div>
  );
}