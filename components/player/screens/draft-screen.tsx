"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameLogo } from "@/components/game/game-logo";
import { LucideLoader2 } from "lucide-react";
import BgAnimated from "@/components/bg-animated";

interface PlayerDraftScreenProps {
  onLeave: () => void;
}

export function PlayerDraftScreen({ onLeave }: PlayerDraftScreenProps) {
  return (
    <div className="h-screen flex items-center justify-center p-6 relative">
      <div>
        <GameLogo size={"SMALL"} />
      </div>
      <Card className="p-8 bg-white w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase flex flex-col items-center gap-2">
          <LucideLoader2 className="size-8 animate-spin" />
          Session en attente
        </h2>
        <p className="text-gray-600 mb-8 text-sm">
          La session ne devrait pas tarder à ouvrir. <br /> Merci pour votre
          patience.
        </p>
        <Button
          variant="outline"
          onClick={onLeave}
          className="w-full text-gray-950 border-gray-950"
        >
          Quitter
        </Button>
      </Card>
      <BgAnimated />
    </div>
  );
}
