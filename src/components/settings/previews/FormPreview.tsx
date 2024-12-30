import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Mail, Lock, User, Menu } from "lucide-react";
import { useState } from "react";

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
  const [selectedPreview, setSelectedPreview] = useState<string>("all");

  const renderButtons = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Buttons Examples</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </div>
    );
  };

  const renderInputs = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Inputs Examples</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>
        </div>
      </div>
    );
  };

  const renderDropdowns = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dropdowns Examples</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderSearch = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Search Examples</h3>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8" />
        </div>
      </div>
    );
  };

  const renderIcons = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Icons Examples</h3>
        <div className="flex gap-4">
          <Mail className="h-6 w-6" />
          <Lock className="h-6 w-6" />
          <Search className="h-6 w-6" />
          <Menu className="h-6 w-6" />
        </div>
      </div>
    );
  };

  const renderDividers = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dividers Examples</h3>
        <div className="space-y-4">
          <div className="h-px bg-border" />
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
      </div>
    );
  };

  if (showAllExamples) {
    return (
      <div className="space-y-8">
        <div className="mb-4">
          <Select value={selectedPreview} onValueChange={setSelectedPreview}>
            <SelectTrigger>
              <SelectValue placeholder="Select preview type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Examples</SelectItem>
              <SelectItem value="buttons">Buttons</SelectItem>
              <SelectItem value="inputs">Input Fields</SelectItem>
              <SelectItem value="dropdowns">Dropdowns</SelectItem>
              <SelectItem value="search">Search</SelectItem>
              <SelectItem value="icons">Icons</SelectItem>
              <SelectItem value="dividers">Dividers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(selectedPreview === "all" || selectedPreview === "buttons") && renderButtons()}
        {(selectedPreview === "all" || selectedPreview === "inputs") && renderInputs()}
        {(selectedPreview === "all" || selectedPreview === "dropdowns") && renderDropdowns()}
        {(selectedPreview === "all" || selectedPreview === "search") && renderSearch()}
        {(selectedPreview === "all" || selectedPreview === "icons") && renderIcons()}
        {(selectedPreview === "all" || selectedPreview === "dividers") && renderDividers()}
      </div>
    );
  }

  // Return only the specifically requested preview
  if (showButtons) return renderButtons();
  if (showInputs) return renderInputs();
  if (showDropdowns) return renderDropdowns();
  if (showSearch) return renderSearch();
  if (showIcons) return renderIcons();
  if (showDividers) return renderDividers();

  return null;
}