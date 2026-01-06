"use client";

import { PlayerGrid } from "@/components/game/player-grid";
import { Button } from "@/components/ui/button";
import { GameSession, Player } from "@prisma/client";
import { HardDriveDownload } from "lucide-react";
import { useState } from "react";

interface HostDraftScreenProps {
  session: GameSession & { players: Player[] };
  onPublish: () => void;
}

export function HostDraftScreen({ session, onPublish }: HostDraftScreenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Info de connexion de la session */}
      <div>
        <div className="bg-white p-6 rounded-lg">
          <div className="flex items-center justify-center gap-2">
            <p className="flex flex-col items-center w-full">
              Code de la session :{" "}
              <span className="font-bold text-2xl">{session.code}</span>
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg mt-4 hidden lg:block">
          <PlayerGrid players={session.players} columns={2} />
        </div>
        <div className="bg-white p-6 rounded-lg mt-4 lg:hidden">
          <PlayerGrid players={session.players} columns={1} />
        </div>
      </div>
      <Button
        onClick={onPublish}
        variant="white"
        className="w-full h-auto self-start text-4xl flex items-center justify-center lg:gap-8 cursor-pointer hover:opacity-90 pt-8 pb-8"
      >
        <HardDriveDownload className="size-16 lg:size-12" />
        PUBLIER LA SESSION
      </Button>
    </div>
  );
}
