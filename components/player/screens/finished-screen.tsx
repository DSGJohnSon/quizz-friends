"use client";

import { GameSession, Player } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameLogo } from "@/components/game/game-logo";
import BgAnimated from "@/components/bg-animated";

type SessionWithPlayers = GameSession & { players: Player[] };

interface PlayerFinishedScreenProps {
  session: SessionWithPlayers;
  player: Player;
  onLeave: () => void;
}

export function PlayerFinishedScreen({
  session,
  player,
  onLeave,
}: PlayerFinishedScreenProps) {
  const myScore =
    session.players.find((p) => p.id === player.id)?.totalScore ?? 0;

  return (
    <div className="h-screen flex items-center justify-center p-6 relative">
      <div>
        <GameLogo size={"SMALL"} />
      </div>
      <Card className="p-8 bg-white max-w-md w-full text-center">
        <h2 className="text-3xl text-gray-950 font-bold mb-4">Jeu terminé !</h2>

        <div className="my-8 py-6 bg-gray-100 rounded-xl border border-white/10">
          <p className="text-sm text-gray-950 uppercase tracking-widest mb-2">
            Score Final
          </p>
          <p className="text-5xl font-black text-gray-950">{myScore}</p>
        </div>
      </Card>
      <BgAnimated />
    </div>
  );
}
