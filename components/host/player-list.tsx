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
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                player.isConnected ? "bg-green-500" : "bg-red-500 animate-pulse"
              }`}
              title={player.isConnected ? "Connecté" : "Déconnecté"}
            />
            <span
              className={`text-[10px] uppercase font-bold ${
                player.isConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              {player.isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
