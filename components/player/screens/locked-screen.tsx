"use client";

import { GameSession, Player } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameLogo } from "@/components/game/game-logo";
import BgAnimated from "@/components/bg-animated";

type SessionWithPlayers = GameSession & { players: Player[] };

interface PlayerLockedScreenProps {
  session: SessionWithPlayers;
  player: Player;
  onLeave: () => void;
}

export function PlayerLockedScreen({
  session,
  player,
  onLeave,
}: PlayerLockedScreenProps) {
  return (
    <div className="h-screen flex items-center justify-center p-6 relative">
      <div>
        <GameLogo size={"SMALL"} />
      </div>
      <Card className="p-6 bg-white w-full text-center">
        <div className="flex items-center justify-center gap-4 w-full">
          <div
            className="w-20 h-20 aspect-square rounded-full"
            style={{ backgroundColor: player.color }}
          />
          <div className="flex flex-col max-w-full">
            <h2 className="text-3xl text-left font-bold text-gray-900">
              {player.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                Score actuel :
              </span>
              <span className="text-2xl font-black text-indigo-700 tabular-nums">
                {session.players.find((p) => p.id === player.id)?.totalScore ??
                  0}
              </span>
            </div>
          </div>
        </div>

        <div className="block h-px w-full bg-gray-950 mt-8"></div>

        <div>
          <h2 className="text-2xl text-balance font-bold text-gray-900 mb-4 uppercase flex flex-col items-center gap-2 mt-8">
            Tout le monde est prêt !
          </h2>
          <p className="text-gray-600 mb-8 text-sm">
            La partie va commencer.
          </p>
        </div>
      </Card>
      <BgAnimated />
    </div>
  );
}
