import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddUseCaseModal } from "@/components/use-cases/AddUseCaseModal";
import { supabase } from "@/integrations/supabase/client";

export default function WhatPrompting() {
  const { data: useCases } = useQuery({
    queryKey: ["use-cases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("use_cases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">What ya prompting for? 🤔</h1>
      
      <AddUseCaseModal />
      
      <div className="grid gap-6 md:grid-cols-2">
        {useCases?.map((useCase) => (
          <Card key={useCase.id}>
            <CardHeader>
              <CardTitle>{useCase.title}</CardTitle>
              <CardDescription>{useCase.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{useCase.enhancer}</p>
            </CardContent>
          </Card>
        ))}

        {!useCases?.length && (
          <div className="col-span-2 text-center text-muted-foreground">
            No use cases found. Add your first one!
          </div>
        )}
      </div>
    </div>
  );
}