import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AddUseCaseModal } from "@/components/use-cases/AddUseCaseModal";
import { UseCaseCard } from "@/components/use-cases/UseCaseCard";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WhatPrompting() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { data: useCases, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">What ya prompting for? 🤔</h1>
          <Button disabled className="bg-[#98c5f2] hover:bg-[#7ab0e8] text-white">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">What ya prompting for? 🤔</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setIsAddModalOpen(true)} 
                className="bg-[#98c5f2] hover:bg-[#7ab0e8] text-white"
              >
                <Plus className="mr-2 h-4 w-4 dark:text-primary black:text-primary" />
                New Use Case
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a new use case</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <AddUseCaseModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {useCases?.map((useCase) => (
          <UseCaseCard key={useCase.id} useCase={useCase} />
        ))}

        {!useCases?.length && !isLoading && (
          <div className="col-span-2 text-center text-muted-foreground">
            No use cases found. Add your first one!
          </div>
        )}
      </div>
    </div>
  );
}