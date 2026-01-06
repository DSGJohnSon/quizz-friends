"use client";

import { PlayerGrid } from "@/components/game/player-grid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GameSession, Player } from "@prisma/client";
import { Lock, Undo2 } from "lucide-react";

interface HostOpenScreenProps {
  session: GameSession & { players: Player[] };
  onLock: () => void;
  onDraft: () => void;
}

export function HostOpenScreen({
  session,
  onLock,
  onDraft,
}: HostOpenScreenProps) {
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
            <p className="flex flex-col items-center w-full text-balance text-center">
              Nombre de joueurs :{" "}
              <span className="font-bold text-2xl">
                {session.players.length} candidat
                {session.players.length === 1 ? "" : "s"}
              </span>
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
      <div className="flex flex-col gap-4">
        <Button
          onClick={onLock}
          variant="white"
          className="w-full h-auto self-start text-4xl flex items-center justify-center lg:gap-8 cursor-pointer hover:opacity-90 pt-8 pb-8"
        >
          <Lock className="size-16 lg:size-12" />
          Fermer les inscriptions
        </Button>
        <Button
          onClick={onDraft}
          variant="destructive"
          className="w-full h-auto rounded-xl self-start text-4xl text-white flex items-center justify-center lg:gap-8 cursor-pointer hover:opacity-90 pt-8 pb-8"
        >
          <Undo2 className="size-16 lg:size-12" />
          Remettre en brouillon
        </Button>
      </div>
    </div>
  );
}
