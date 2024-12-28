import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ColorTheme } from "@/lib/colorUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchModelsProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  currentTheme: ColorTheme;
  providers: string[];
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  isPaid: boolean | null;
  onPriceFilterChange: (isPaid: boolean | null) => void;
}

export function SearchModels({ 
  searchTerm, 
  onSearch, 
  currentTheme,
  providers,
  selectedProvider,
  onProviderChange,
  isPaid,
  onPriceFilterChange
}: SearchModelsProps) {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1">
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
      
      <Select value={selectedProvider} onValueChange={onProviderChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All providers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All providers</SelectItem>
          {providers.map((provider) => (
            <SelectItem key={provider} value={provider}>
              {provider}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={isPaid === null ? 'all' : isPaid.toString()} 
        onValueChange={(value) => {
          if (value === 'all') onPriceFilterChange(null);
          else onPriceFilterChange(value === 'true');
        }}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Price" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="false">Free</SelectItem>
          <SelectItem value="true">Paid</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}