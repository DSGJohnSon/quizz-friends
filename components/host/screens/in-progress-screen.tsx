"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameSession } from "@prisma/client";
import { DisplayState } from "@/domain/display/display.types";
import { CreditCard, Users, LayoutTemplate } from "lucide-react";

interface HostInProgressScreenProps {
  session: GameSession;
  displayState: DisplayState;
  onUpdateDisplay: (action: any) => Promise<void>;
  onFinish: () => void;
}

export function HostInProgressScreen({
  session,
  displayState,
  onUpdateDisplay,
  onFinish,
}: HostInProgressScreenProps) {
  const currentDisplay2 = (displayState as any)?.display2?.view?.type;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-blue-50/30 border-blue-100">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-blue-600" />
          Contrôle Écran Secondaire
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant={currentDisplay2 === "LOBBY" ? "default" : "outline"}
            onClick={() =>
              onUpdateDisplay({ type: "SHOW_LOBBY", target: "DISPLAY_2" })
            }
            className={`h-auto py-4 flex flex-col gap-2 ${
              currentDisplay2 === "LOBBY"
                ? "bg-purple-600 hover:bg-purple-700"
                : ""
            }`}
          >
            <Users className="w-6 h-6" />
            <span>Joueurs</span>
          </Button>

          <Button
            variant={currentDisplay2 === "SCOREBOARD" ? "default" : "outline"}
            onClick={() =>
              onUpdateDisplay({ type: "SHOW_SCOREBOARD", target: "DISPLAY_2" })
            }
            className={`h-auto py-4 flex flex-col gap-2 ${
              currentDisplay2 === "SCOREBOARD"
                ? "bg-blue-600 hover:bg-blue-700"
                : ""
            }`}
          >
            <CreditCard className="w-6 h-6" />
            <span>Scoreboard</span>
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-gray-900">Actions de jeu</h3>
        <Button
          onClick={onFinish}
          variant="destructive"
          size="lg"
          className="w-full"
        >
          Terminer la session
        </Button>
      </Card>
    </div>
  );
}
