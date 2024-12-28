import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useModelsData } from "@/components/models/useModelsData";
import { ModelsList } from "@/components/models/ModelsList";
import { useToast } from "@/hooks/use-toast";

export default function Account() {
  const { selectedModels, refetch } = useModelsData();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Models refreshed",
        description: "Your model list has been updated",
      });
    } catch (error) {
      toast({
        title: "Error refreshing models",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="bg-background text-foreground">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Account Settings</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Models
          </Button>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="models">
              <AccordionTrigger>Selected Models</AccordionTrigger>
              <AccordionContent>
                <div className="pt-4">
                  <ModelsList
                    models={selectedModels}
                    onAdd={() => {}}
                    modelsInUse={selectedModels.map(m => m.id)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}