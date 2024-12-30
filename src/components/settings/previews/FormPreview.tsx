import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormPreviewProps {
  showAllExamples?: boolean;
  showButtons?: boolean;
  showInputs?: boolean;
  showDropdowns?: boolean;
  showSearch?: boolean;
  showIcons?: boolean;
  showDividers?: boolean;
}

export function FormPreview({ 
  showAllExamples = false,
  showButtons = false,
  showInputs = false,
  showDropdowns = false,
  showSearch = false,
  showIcons = false,
  showDividers = false,
}: FormPreviewProps) {
  const renderButtons = () => (
    <div className="flex gap-4">
      <Button>Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="ghost">Ghost Button</Button>
    </div>
  );

  const renderInputs = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="text-sm font-medium">Email</span>
        <Input type="email" placeholder="Enter your email" />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-medium">Password</span>
        <Input type="password" placeholder="Enter your password" />
      </div>
    </div>
  );

  const renderDropdowns = () => (
    <div className="space-y-4">
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
          <SelectItem value="3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderSearch = () => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
      <Input
        type="search"
        placeholder="Search..."
        className="pl-10"
      />
    </div>
  );

  const renderIcons = () => (
    <div className="flex gap-4">
      <Mail className="h-6 w-6" />
      <Lock className="h-6 w-6" />
      <Search className="h-6 w-6" />
      <SlidersHorizontal className="h-6 w-6" />
    </div>
  );

  const renderDividers = () => (
    <div className="space-y-4">
      <div className="border-t" />
      <div className="flex items-center">
        <div className="flex-1 border-t" />
        <span className="px-4 text-sm text-muted-foreground">OR</span>
        <div className="flex-1 border-t" />
      </div>
    </div>
  );

  if (showAllExamples) {
    return (
      <div className="space-y-8">
        {renderButtons()}
        {renderInputs()}
        {renderDropdowns()}
        {renderSearch()}
        {renderIcons()}
        {renderDividers()}
      </div>
    );
  }

  // Only return the specifically requested preview
  if (showButtons) return renderButtons();
  if (showInputs) return renderInputs();
  if (showDropdowns) return renderDropdowns();
  if (showSearch) return renderSearch();
  if (showIcons) return renderIcons();
  if (showDividers) return renderDividers();

  return null;
}