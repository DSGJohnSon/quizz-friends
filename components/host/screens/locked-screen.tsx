"use client";

import { Button } from "@/components/ui/button";
import { GameSession } from "@prisma/client";
import { DoorOpen, Lock, Rocket, Undo2 } from "lucide-react";

interface HostLockedScreenProps {
  session: GameSession;
  onStart: () => void;
  onOpen: () => void;
}

export function HostLockedScreen({
  session,
  onStart,
  onOpen,
}: HostLockedScreenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="flex flex-col gap-4">
        <Button
          onClick={onStart}
          variant="white"
          className="w-full h-auto self-start text-4xl flex items-center justify-center lg:gap-8 cursor-pointer hover:opacity-90 pt-8 pb-8"
        >
          <Rocket className="size-16 lg:size-12" />
          Lancer la partie
        </Button>
        <Button
          onClick={onOpen}
          variant="themeColor"
          className="w-full h-auto rounded-xl self-start text-4xl text-white bg-white/20 border-3 border-white flex items-center justify-center lg:gap-8 cursor-pointer hover:opacity-90 pt-8 pb-8"
        >
          <DoorOpen className="size-16 lg:size-12" />
          Réouvrir les inscriptions
        </Button>
      </div>
    </div>
  );
}
