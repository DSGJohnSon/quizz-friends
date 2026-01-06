"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameSession } from "@prisma/client";

interface HostPublishedScreenProps {
  session: GameSession;
  onOpen: () => void;
}

export function HostPublishedScreen({
  session,
  onOpen,
}: HostPublishedScreenProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">État : Publiée</h2>
        <p className="text-gray-600 mb-6">
          La session est prête. Vous pouvez maintenant ouvrir les inscriptions
          pour permettre aux joueurs de rejoindre.
        </p>
        <Button onClick={onOpen} size="lg" className="w-full">
          Ouvrir les inscriptions
        </Button>
      </Card>
    </div>
  );
}
