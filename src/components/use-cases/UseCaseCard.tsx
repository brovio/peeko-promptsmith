import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseCaseCardActions } from "./UseCaseCardActions";
import { EditUseCaseModal } from "./EditUseCaseModal";
import { UseUseCaseModal } from "./UseUseCaseModal";
import { InfoUseCaseModal } from "./InfoUseCaseModal";
import { AddUseCaseModal } from "./AddUseCaseModal";
import { Button } from "@/components/ui/button";
import { Wand } from "lucide-react";
import { StatsModal } from "./StatsModal";

interface UseCaseCardProps {
  useCase: {
    id: string;
    title: string;
    description: string;
    enhancer: string;
  };
}

export function UseCaseCard({ useCase }: UseCaseCardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [useModalOpen, setUseModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{useCase.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStatsModalOpen(true)}
                className="h-8 w-8"
              >
                <Wand className="h-4 w-4" />
              </Button>
              <UseCaseCardActions
                onEdit={() => setEditModalOpen(true)}
                onUse={() => setUseModalOpen(true)}
                onInfo={() => setInfoModalOpen(true)}
                onDuplicate={() => setDuplicateModalOpen(true)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{useCase.description}</p>
        </CardContent>
      </Card>

      <EditUseCaseModal
        useCase={useCase}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />

      <UseUseCaseModal
        useCase={useCase}
        open={useModalOpen}
        onOpenChange={setUseModalOpen}
      />

      <InfoUseCaseModal
        useCase={useCase}
        open={infoModalOpen}
        onOpenChange={setInfoModalOpen}
      />

      {duplicateModalOpen && (
        <AddUseCaseModal
          initialData={{
            title: `${useCase.title} (Copy)`,
            description: useCase.description,
            enhancer: useCase.enhancer,
          }}
          open={duplicateModalOpen}
          onOpenChange={setDuplicateModalOpen}
        />
      )}

      <StatsModal
        useCaseId={useCase.id}
        open={statsModalOpen}
        onOpenChange={setStatsModalOpen}
      />
    </>
  );
}