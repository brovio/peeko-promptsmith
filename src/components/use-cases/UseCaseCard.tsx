import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, X, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditUseCaseModal } from "./EditUseCaseModal";

interface UseCaseCardProps {
  useCase: {
    id: string;
    title: string;
    description: string;
    enhancer: string;
  };
}

export function UseCaseCard({ useCase }: UseCaseCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      <div className="relative perspective-1000">
        <div
          className={cn(
            "w-full transition-transform duration-500 transform-style-preserve-3d",
            isFlipped ? "rotate-y-180" : ""
          )}
        >
          {/* Front of card */}
          <Card className={cn(
            "w-full backface-hidden",
            isFlipped ? "invisible" : ""
          )}>
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={handleFlip}
              >
                <Info className="h-4 w-4" />
              </Button>
              <CardTitle>{useCase.title}</CardTitle>
              <CardDescription className="line-clamp-1">
                {useCase.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                <li>First bullet point</li>
                <li>Second bullet point</li>
                <li>Third bullet point</li>
              </ul>
            </CardContent>
          </Card>

          {/* Back of card */}
          <Card className={cn(
            "w-full absolute top-0 backface-hidden rotate-y-180",
            !isFlipped ? "invisible" : ""
          )}>
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
                  onClick={handleFlip}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle>Enhancer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{useCase.enhancer}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <EditUseCaseModal
        useCase={useCase}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
    </>
  );
}