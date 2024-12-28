import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseCaseCardActions } from "./UseCaseCardActions";
import { EditUseCaseModal } from "./EditUseCaseModal";
import { UseUseCaseModal } from "./UseUseCaseModal";
import { InfoUseCaseModal } from "./InfoUseCaseModal";
import { AddUseCaseModal } from "./AddUseCaseModal";

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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{useCase.title}</CardTitle>
            <UseCaseCardActions
              onEdit={() => setEditModalOpen(true)}
              onUse={() => setUseModalOpen(true)}
              onInfo={() => setInfoModalOpen(true)}
              onDuplicate={() => setDuplicateModalOpen(true)}
            />
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
        />
      )}
    </>
  );
}