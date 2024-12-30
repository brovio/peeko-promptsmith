import { Button } from "@/components/ui/button";
import { RefreshCw, Unlink } from "lucide-react";

interface ValidatedKeyActionsProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  onUnlink: () => void;
}

export function ValidatedKeyActions({ isRefreshing, onRefresh, onUnlink }: ValidatedKeyActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="text-green-600 border-green-600">
        Validated
      </Button>
      <Button 
        variant="outline" 
        onClick={onRefresh} 
        disabled={isRefreshing}
        className="text-blue-600 border-blue-600"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
      <Button variant="outline" onClick={onUnlink} className="text-destructive">
        <Unlink className="h-4 w-4" />
      </Button>
    </div>
  );
}