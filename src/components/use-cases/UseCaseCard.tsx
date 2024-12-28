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
  // Extract key points from the description and enhancer
  const combinedText = `${description} ${enhancer}`;
  
  // Split into sentences and filter out empty ones
  const sentences = combinedText
    .split(/[.!?]/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  // Select up to 3 most relevant sentences as bullet points
  // Prioritize sentences that mention prompts, enhancement, or key features
  const relevantPoints = sentences
    .filter(sentence => 
      sentence.toLowerCase().includes("prompt") ||
      sentence.toLowerCase().includes("enhance") ||
      sentence.toLowerCase().includes("help") ||
      sentence.toLowerCase().includes("improve")
    )
    .slice(0, 3);

  // If we don't have enough relevant points, add other sentences
  while (relevantPoints.length < 3 && sentences.length > relevantPoints.length) {
    const nextSentence = sentences.find(s => !relevantPoints.includes(s));
    if (nextSentence) {
      relevantPoints.push(nextSentence);
    } else {
      break;
    }
  }

  // Format the points to be more concise
  return relevantPoints.map(point => 
    point.length > 100 ? `${point.substring(0, 97)}...` : point
  );
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