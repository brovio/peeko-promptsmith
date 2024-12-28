import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  providers: string[];
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  isPaid: boolean | null;
  onPriceFilterChange: (isPaid: boolean | null) => void;
}

export function SearchModels({ 
  searchTerm, 
  onSearch, 
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
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
          size={20}
        />
        <Input
          type="search"
          placeholder="Search models..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 bg-white text-gray-900 placeholder:text-gray-500 border-gray-200 focus:border-blue-500"
        />
      </div>
      
      <Select value={selectedProvider} onValueChange={onProviderChange}>
        <SelectTrigger className="w-[140px] bg-white text-gray-900 border-gray-200">
          <SelectValue placeholder="All providers" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all" className="text-gray-900">All providers</SelectItem>
          {providers.map((provider) => (
            <SelectItem key={provider} value={provider} className="text-gray-900">
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
        <SelectTrigger className="w-[100px] bg-white text-gray-900 border-gray-200">
          <SelectValue placeholder="Price" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all" className="text-gray-900">All</SelectItem>
          <SelectItem value="false" className="text-gray-900">Free</SelectItem>
          <SelectItem value="true" className="text-gray-900">Paid</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}