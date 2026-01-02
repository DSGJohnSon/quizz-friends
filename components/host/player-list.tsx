"use client";

import { Player } from "@prisma/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PlayerList({ players }: { players: Player[] }) {
  const [amounts, setAmounts] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  if (players.length === 0) {
    return <p className="text-sm text-gray-500">Aucun joueur pour le moment</p>;
  }

  async function handleAwardPoints(playerId: string, delta: number) {
    const amount = parseInt(amounts[playerId] || "0");
    if (isNaN(amount) || amount <= 0) return;

    const points = delta > 0 ? amount : -amount;
    const reason = `${
      delta > 0 ? "Ajout" : "Suppression"
    } de ${amount} points : Intervention du présentateur`;

    setLoading((prev) => ({ ...prev, [playerId]: true }));
    try {
      const res = await fetch(`/api/players/${playerId}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points, reason }),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      // Reset input on success
      setAmounts((prev) => ({ ...prev, [playerId]: "" }));
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du score");
    } finally {
      setLoading((prev) => ({ ...prev, [playerId]: false }));
    }
  }

  return (
    <ul className="space-y-3">
      {players.map((player) => (
        <li
          key={player.id}
          className="flex flex-col gap-2 p-3 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full shrink-0 shadow-sm border-2 border-white"
              style={{ backgroundColor: player.color }}
            />
            <div className="flex-1 flex items-center justify-between gap-4">
              <span className="font-semibold text-gray-900">{player.name}</span>
              <span className="text-xl font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg min-w-14 text-center tabular-nums shadow-sm border border-blue-100">
                {player.totalScore}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  player.isConnected
                    ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                    : "bg-red-500 animate-pulse"
                }`}
                title={player.isConnected ? "Connecté" : "Déconnecté"}
              />
              <span
                className={`text-[10px] uppercase font-black tracking-wider ${
                  player.isConnected ? "text-green-600" : "text-red-600"
                }`}
              >
                {player.isConnected ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          {/* Contrôles de score */}
          <div className="flex items-center gap-2 mt-1 pt-2 border-t border-gray-100/50">
            <div className="relative flex-1 max-w-[100px]">
              <Input
                type="number"
                placeholder="10"
                value={amounts[player.id] || ""}
                onChange={(e) =>
                  setAmounts((prev) => ({
                    ...prev,
                    [player.id]: e.target.value,
                  }))
                }
                className="h-8 text-xs pr-7 text-center font-bold"
                min="1"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 pointer-events-none">
                pts
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                onClick={() => handleAwardPoints(player.id, -1)}
                disabled={loading[player.id] || !amounts[player.id]}
                title="Retirer des points"
              >
                <span className="text-lg font-bold">−</span>
              </Button>
              <Button
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleAwardPoints(player.id, 1)}
                disabled={loading[player.id] || !amounts[player.id]}
                title="Ajouter des points"
              >
                <span className="text-lg font-bold">+</span>
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
