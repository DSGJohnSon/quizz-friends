"use client";

import { useCallback, useEffect, useState } from "react";
import { GameSession, Player } from "@prisma/client";
import { useRealtimeSession } from "@/hooks/use-realtime-session";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VersionDisplay } from "@/components/version-display";
import { useRouter } from "next/navigation";

type SessionWithPlayers = GameSession & { players: Player[] };

export function PlayerWaitingRoom({
  session: initialSession,
  player,
}: {
  session: SessionWithPlayers;
  player: Player;
}) {
  const router = useRouter();
  const [session, setSession] = useState(initialSession);

  const handleRealtimeEvent = useCallback(() => {
    fetch(`/api/sessions/${session.id}`)
      .then((res) => res.json())
      .then(setSession)
      .catch(console.error);
  }, [session.id]);

  useRealtimeSession(session.id, handleRealtimeEvent);

  // Fonction pour quitter la session
  function handleLeave() {
    // Nettoyer le localStorage
    localStorage.removeItem(`player_${session.code}`);
    // Retourner à la page d'accueil
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="p-8 bg-white">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4"
              style={{ backgroundColor: player.color }}
            />
            <h2 className="text-2xl font-bold text-gray-900">{player.name}</h2>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {session.title}
            </h3>
            <p className="text-sm text-gray-600">
              {session.status === "OPEN" && "En attente des autres joueurs..."}
              {session.status === "LOCKED" && "Le jeu va bientôt commencer !"}
              {session.status === "IN_PROGRESS" && "Jeu en cours"}
              {session.status === "FINISHED" && "Jeu terminé"}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Joueurs ({session.players?.length || 0}/
              {session.expectedPlayerCount})
            </h4>
            <div className="space-y-2">
              {(session.players || []).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                >
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="font-medium text-gray-900">{p.name}</span>
                  {p.id === player.id && (
                    <span className="ml-auto text-xs text-gray-500">
                      (Vous)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={handleLeave} className="w-full">
            Quitter la session
          </Button>
        </Card>
      </div>
      <VersionDisplay />
    </div>
  );
}
