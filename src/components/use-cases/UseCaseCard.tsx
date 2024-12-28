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

export function UseCaseCard({ useCase }: UseCaseCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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
            <li>First bullet point</li>
            <li>Second bullet point</li>
            <li>Third bullet point</li>
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