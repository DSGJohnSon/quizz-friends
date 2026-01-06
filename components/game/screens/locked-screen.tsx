import { motion } from "framer-motion";
import { GameSession, Player } from "@prisma/client";
import { PlayerGrid } from "@/components/game/player-grid";

interface LockedScreenProps {
  session: GameSession & { players: Player[] };
  displayTarget: "DISPLAY_1" | "DISPLAY_2";
}

export function LockedScreen({ session, displayTarget }: LockedScreenProps) {
  if (displayTarget === "DISPLAY_2") {
    return null;
  }

  return (
    <div className="h-full w-full pt-92 px-32 pb-24 flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-4">La partie va commencer !</h2>
        <p className="text-2xl opacity-80">Les inscriptions sont closes.</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <PlayerGrid players={session.players} columns={session.players.length > 3 ? 2 : session.players.length > 6 ? 3 : session.players.length > 9 ? 4 : 1} />
      </div>
    </div>
  );
}
