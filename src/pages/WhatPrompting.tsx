import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AddUseCaseModal } from "@/components/use-cases/AddUseCaseModal";
import { UseCaseCard } from "@/components/use-cases/UseCaseCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function WhatPrompting() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
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
      
      <Button onClick={() => setIsAddModalOpen(true)} className="mb-6">
        <Plus className="mr-2 h-4 w-4" />
        Add New Use Case
      </Button>
      
      <AddUseCaseModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {useCases?.map((useCase) => (
          <UseCaseCard key={useCase.id} useCase={useCase} />
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