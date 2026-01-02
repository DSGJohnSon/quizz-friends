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
  const [isOnline, setIsOnline] = useState(true);
  const [isHeartbeatFailing, setIsHeartbeatFailing] = useState(false);

  // Heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/players/${player.id}/heartbeat`, { method: "POST" })
        .then((res) => {
          if (!res.ok) throw new Error("Heartbeat failed");
          setIsHeartbeatFailing(false);
        })
        .catch(() => setIsHeartbeatFailing(true));
    }, 3000);

    return () => clearInterval(interval);
  }, [player.id]);

  // Network listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRealtimeEvent = useCallback(() => {
    fetch(`/api/sessions/${session.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Session fetch failed");
        return res.json();
      })
      .then((data) => {
        setSession(data);
        setIsHeartbeatFailing(false);
      })
      .catch(() => setIsHeartbeatFailing(true));
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

      {(!isOnline || isHeartbeatFailing) && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
          <Card className="max-w-xs w-full p-8 text-center animate-pulse">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Reconnexion...
                </h3>
                <p className="text-sm text-gray-600">
                  {!isOnline
                    ? "Votre connexion internet semble interrompue."
                    : "Tentative de synchronisation avec le serveur."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <VersionDisplay />
    </div>
  );
}
