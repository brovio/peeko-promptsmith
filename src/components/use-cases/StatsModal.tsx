import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface StatsModalProps {
  useCaseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StatsModal({ useCaseId, open, onOpenChange }: StatsModalProps) {
  const { data: operations, isLoading } = useQuery({
    queryKey: ["use-case-operations", useCaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("use_case_operations")
        .select("*")
        .eq("use_case_id", useCaseId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const getTotalStats = () => {
    if (!operations?.length) return { tokens: 0, cost: 0, words: 0 };
    return operations.reduce(
      (acc, op) => ({
        tokens: acc.tokens + (op.tokens_used || 0),
        cost: acc.cost + (op.cost || 0),
        words: acc.words + (op.words_changed || 0),
      }),
      { tokens: 0, cost: 0, words: 0 }
    );
  };

  const totals = getTotalStats();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>AI Operations Statistics</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.tokens.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totals.cost.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Words Changed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.words.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {isLoading ? (
            <div className="text-center">Loading statistics...</div>
          ) : !operations?.length ? (
            <div className="text-center text-muted-foreground">
              No AI operations performed yet
            </div>
          ) : (
            <div className="space-y-4">
              {operations.map((op) => (
                <Card key={op.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg capitalize">{op.operation_type}</CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(op.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Tokens Used</div>
                        <div className="font-medium">{op.tokens_used?.toLocaleString() || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Cost</div>
                        <div className="font-medium">${op.cost?.toFixed(4) || "0.0000"}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Words Changed</div>
                        <div className="font-medium">{op.words_changed?.toLocaleString() || 0}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Changes</div>
                      <div className="text-sm bg-muted p-2 rounded">
                        <div className="line-through text-muted-foreground">
                          {op.original_text}
                        </div>
                        <div className="text-green-500">{op.modified_text}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}