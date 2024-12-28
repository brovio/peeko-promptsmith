import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Play, Info } from "lucide-react";
import { EditUseCaseModal } from "./EditUseCaseModal";
import { UseUseCaseModal } from "./UseUseCaseModal";
import { InfoUseCaseModal } from "./InfoUseCaseModal";

interface UseCaseCardProps {
  useCase: {
    id: string;
    title: string;
    description: string;
    enhancer: string;
  };
}

function generateBulletPoints(description: string, enhancer: string): string[] {
  // Generate helpful tips based on the use case content
  const tips = [];
  
  // First tip about the primary purpose
  tips.push(`Use this template to ${description.split('.')[0].toLowerCase()}`);
  
  // Second tip about specific benefits
  if (description.toLowerCase().includes('coding')) {
    tips.push("Structure and refine your prompts specifically for programming tasks and code generation");
  } else {
    tips.push("Enhance your prompts with improved clarity, specificity, and logical structure");
  }
  
  // Third tip about the enhancement process
  const enhancementTip = enhancer
    .split('.')
    .find(s => s.toLowerCase().includes('help') || s.toLowerCase().includes('improve'));
    
  if (enhancementTip) {
    tips.push(enhancementTip.trim());
  } else {
    tips.push("The template will guide you through creating more effective and focused prompts");
  }
  
  return tips;
}

export function UseCaseCard({ useCase }: UseCaseCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const bulletPoints = generateBulletPoints(useCase.description, useCase.enhancer);

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow duration-200">
        <CardHeader className="relative pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-left text-xl">{useCase.title}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsUseModalOpen(true)}
              >
                <Play className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsInfoModalOpen(true)}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="h-px bg-border mx-6 my-4" />

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
            <CardDescription className="text-sm text-foreground text-left">
              {useCase.description}
            </CardDescription>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Hints & Tips</h4>
            <ul className="space-y-3 list-disc list-inside text-left">
              {bulletPoints.map((point, index) => (
                <li 
                  key={index} 
                  className="text-sm text-foreground leading-relaxed pl-2"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <EditUseCaseModal
        useCase={useCase}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
      <UseUseCaseModal
        useCase={useCase}
        open={isUseModalOpen}
        onOpenChange={setIsUseModalOpen}
      />
      <InfoUseCaseModal
        useCase={useCase}
        open={isInfoModalOpen}
        onOpenChange={setIsInfoModalOpen}
      />
    </>
  );
}