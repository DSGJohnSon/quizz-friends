"use client";

import { Player } from "@prisma/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // Unused

export function PlayerList({ players }: { players: Player[] }) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [modes, setModes] = useState<{ [key: string]: "add" | "remove" }>({});

  if (players.length === 0) {
    return <p className="text-sm text-gray-500">Aucun joueur pour le moment</p>;
  }

  async function handleAwardPoints(playerId: string, points: number) {
    const mode = modes[playerId] || "add";
    const finalPoints = mode === "add" ? points : -points;
    const reason = `${finalPoints > 0 ? "Ajout" : "Suppression"} de ${Math.abs(
      finalPoints
    )} points : Intervention du présentateur`;

    setLoading((prev) => ({ ...prev, [playerId]: true }));
    try {
      const res = await fetch(`/api/players/${playerId}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: finalPoints, reason }),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du score");
    } finally {
      setLoading((prev) => ({ ...prev, [playerId]: false }));
    }
  }

  const toggleMode = (playerId: string) => {
    setModes((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || "add") === "add" ? "remove" : "add",
    }));
  };

  return (
    <ul className="space-y-2">
      {players.map((player) => {
        const mode = modes[player.id] || "add";
        const isRemove = mode === "remove";

        return (
          <li
            key={player.id}
            className="flex flex-col gap-2 p-3 rounded-lg bg-gray-200/50"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full shrink-0 shadow-sm border-2 border-white"
                style={{ backgroundColor: player.color }}
              />
              <div className="flex-1 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900 leading-none">
                    {player.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        player.isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        player.isConnected ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {player.isConnected ? "En ligne" : "Hors ligne"}
                    </span>
                  </div>
                </div>
                <span className="text-xl font-bold text-white bg-indigo-500 px-3 py-1 rounded-lg min-w-14 text-center tabular-nums">
                  {player.totalScore}
                </span>
              </div>
            </div>

            {/* Contrôles de score */}
            <div className="flex items-center gap-2 mt-1">
              {/* Switch +/- */}
              <Button
                variant="ghost"
                onClick={() => toggleMode(player.id)}
                className={`w-10 h-8 shrink-0 transition-colors ${
                  isRemove
                    ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                    : "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                }`}
              >
                <span className="text-2xl pb-1 leading-none">
                  {isRemove ? "-" : "+"}
                </span>
              </Button>

              {/* Quick Actions */}
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 5].map((val) => (
                  <Button
                    key={val}
                    variant="ghost"
                    className={`h-8 flex-1 font-bold text-xl border transition-all ${
                      isRemove
                        ? "text-red-600 border-red-600 bg-red-100 hover:bg-red-200 cursor-pointer"
                        : "text-green-600 border-green-600 bg-green-100 hover:bg-green-200 cursor-pointer"
                    }`}
                    onClick={() => handleAwardPoints(player.id, val)}
                    disabled={loading[player.id]}
                  >
                    {val}
                  </Button>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
