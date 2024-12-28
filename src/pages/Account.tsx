import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useModelsData } from "@/components/models/useModelsData";
import { ModelsList } from "@/components/models/ModelsList";

export default function Account() {
  const { selectedModels } = useModelsData();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
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