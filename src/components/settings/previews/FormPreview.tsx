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
  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      {(showAllExamples || showSearch) && (
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10"
            />
          </div>
          {showDropdowns && (
            <Select>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          )}
          {showButtons && (
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Input Fields */}
      {(showAllExamples || showInputs) && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {showIcons && <Mail className="h-4 w-4 text-foreground" />}
              <span className="text-sm font-medium">Email</span>
            </div>
            <Input type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {showIcons && <Lock className="h-4 w-4 text-foreground" />}
              <span className="text-sm font-medium">Password</span>
            </div>
            <Input type="password" placeholder="Enter your password" />
          </div>
          {showButtons && <Button className="w-full">Sign In</Button>}
        </div>
      )}

      {/* Divider Example */}
      {(showAllExamples || showDividers) && (
        <div className="space-y-2">
          <div className="border-t border-border" />
          <div className="flex items-center">
            <div className="flex-1 border-t border-border" />
            <span className="px-4 text-sm text-muted-foreground">OR</span>
            <div className="flex-1 border-t border-border" />
          </div>
        </div>
      )}
    </div>
  );
}