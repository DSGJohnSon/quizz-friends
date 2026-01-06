import { Player } from "@prisma/client";
import { LucideLoader2 } from "lucide-react";

export function PlayerGrid({
  players = [],
  columns = 1,
}: {
  players?: Player[];
  columns?: number;
}) {
  if (!players || players.length === 0) {
    return (
      <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
        <LucideLoader2 className="size-10 animate-spin" />
        <p className="text-white/70 text-lg">En attente de joueurs...</p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {players.map((player) => (
        <div
          key={player.id}
          className={`flex items-center gap-3 bg-gray-900/50 border border-gray-600/50 rounded-xl p-4 transition-opacity duration-300 ${
            player.isConnected ? "opacity-100" : "opacity-50"
          }`}
        >
          <div className="relative">
            <div
              className="w-12 h-12 rounded-full shrink-0"
              style={{ backgroundColor: player.color }}
            />
            <div
              className={`absolute -bottom-1 -right-1 un w-4 h-4 rounded-full border-2 border-gray-900 ${
                player.isConnected
                  ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  : "bg-red-500"
              }`}
            />
          </div>
          <span className="text-xl font-semibold">{player.name}</span>
          {!player.isConnected && (
            <span className="text-xs text-red-400 uppercase font-bold tracking-wider ml-auto">
              Offline
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
