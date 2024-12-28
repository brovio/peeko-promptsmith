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
  
  // First tip is always about the primary purpose
  tips.push(`Use this template for ${description.split('.')[0].toLowerCase()}`);
  
  // Second tip about how it helps
  tips.push(`This use case will help you structure and refine your prompts specifically for ${description.toLowerCase().includes('coding') ? 'programming tasks' : 'your needs'}`);
  
  // Third tip about the enhancement process
  const enhancementTip = enhancer
    .split('.')
    .find(s => s.toLowerCase().includes('help') || s.toLowerCase().includes('improve'));
    
  if (enhancementTip) {
    tips.push(enhancementTip.trim());
  } else {
    tips.push("Follow the provided template to make your prompts more effective and focused");
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
      <Card className="w-full">
        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-left">{useCase.title}</CardTitle>
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
          <CardDescription className="text-sm text-muted-foreground text-left">
            {useCase.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 list-disc list-inside text-left">
            {bulletPoints.map((point, index) => (
              <li 
                key={index} 
                className="text-sm text-muted-foreground leading-relaxed pl-2"
              >
                {point}
              </li>
            ))}
          </ul>
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