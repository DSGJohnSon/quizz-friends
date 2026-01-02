import { Player } from "@prisma/client";

export function PlayerGrid({ players }: { players: Player[] }) {
  if (players.length === 0) {
    return <p className="text-white/70 text-lg">En attente de joueurs...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {players.map((player) => (
        <div
          key={player.id}
          className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg"
        >
          <div
            className="w-12 h-12 rounded-full shrink-0"
            style={{ backgroundColor: player.color }}
          />
          <span className="text-xl font-semibold">{player.name}</span>
        </div>
      ))}
    </div>
  );
}
