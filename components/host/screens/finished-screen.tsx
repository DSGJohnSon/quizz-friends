"use client";

import { Card } from "@/components/ui/card";
import { GameSession } from "@prisma/client";

interface HostFinishedScreenProps {
  session: GameSession;
}

export function HostFinishedScreen({ session }: HostFinishedScreenProps) {
  return (
    <div className="space-y-6">
      <Card className="p-8 text-center bg-gray-50">
        <h2 className="text-xl font-bold mb-2">Session Terminée</h2>
        <p className="text-gray-500">
          La session est close. Merci d&apos;avoir joué !
        </p>
      </Card>
    </div>
  );
}
