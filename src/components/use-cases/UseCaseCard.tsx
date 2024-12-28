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
  // Extract key phrases from the description and enhancer
  const combinedText = `${description} ${enhancer}`;
  
  // Split into phrases and clean them up
  const phrases = combinedText
    .split(/[.!?]/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => {
      // Remove common filler words at the start
      return s.replace(/^(this|the|it|there|these|those|a|an)\s+/i, '')
        // Capitalize first letter
        .replace(/^\w/, c => c.toUpperCase());
    });
  
  // Prioritize key phrases about prompts and enhancements
  const relevantPhrases = phrases
    .filter(phrase => 
      phrase.toLowerCase().includes("prompt") ||
      phrase.toLowerCase().includes("enhance") ||
      phrase.toLowerCase().includes("help") ||
      phrase.toLowerCase().includes("improve")
    )
    .map(phrase => {
      // Take only the first part of the phrase up to a comma or conjunction
      const shortened = phrase.split(/,|\sand\s|\sor\s|\sbut\s/)[0];
      // Limit to 60 characters and add ellipsis if needed
      return shortened.length > 60 ? `${shortened.substring(0, 57)}...` : shortened;
    })
    .slice(0, 3);

  // If we don't have enough relevant phrases, add other short phrases
  while (relevantPhrases.length < 3 && phrases.length > relevantPhrases.length) {
    const nextPhrase = phrases
      .find(p => !relevantPhrases.includes(p))
      ?.split(/,|\sand\s|\sor\s|\sbut\s/)[0];
    
    if (nextPhrase) {
      const shortened = nextPhrase.length > 60 ? 
        `${nextPhrase.substring(0, 57)}...` : 
        nextPhrase;
      relevantPhrases.push(shortened);
    } else {
      break;
    }
  }

  return relevantPhrases;
}

export function UseCaseCard({ useCase }: UseCaseCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const bulletPoints = generateBulletPoints(useCase.description, useCase.enhancer);

  return (
    <>
      <Card className="w-full">
        <CardHeader className="relative">
          <div className="absolute right-4 top-4 flex gap-2">
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
          <CardTitle>{useCase.title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {useCase.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1">
            {bulletPoints.map((point, index) => (
              <li key={index} className="text-sm text-muted-foreground">
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