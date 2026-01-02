import { Player } from "@prisma/client";

export function PlayerList({ players }: { players: Player[] }) {
  if (players.length === 0) {
    return <p className="text-sm text-gray-500">Aucun joueur pour le moment</p>;
  }

  return (
    <ul className="space-y-2">
      {players.map((player) => (
        <li
          key={player.id}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
        >
          <div
            className="w-8 h-8 rounded-full flex-shrink-0"
            style={{ backgroundColor: player.color }}
          />
          <span className="font-medium flex-1">{player.name}</span>
          {player.isConnected && (
            <span
              className="w-2 h-2 bg-green-500 rounded-full"
              title="Connecté"
            />
          )}
        </li>
      ))}
    </ul>
  );
}
