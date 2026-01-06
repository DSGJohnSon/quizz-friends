"use client";

import { useCallback, useEffect, useState } from "react";
import { GameSession, Player } from "@prisma/client";
import { useRealtimeSession } from "@/hooks/use-realtime-session";
import { useRouter } from "next/navigation";
import { PlayerDraftScreen } from "./screens/draft-screen";
import { PlayerOpenScreen } from "./screens/open-screen";
import { PlayerLockedScreen } from "./screens/locked-screen";
import { PlayerInProgressScreen } from "./screens/in-progress-screen";
import { PlayerFinishedScreen } from "./screens/finished-screen";
import { Card } from "@/components/ui/card";

type SessionWithPlayers = GameSession & { players: Player[] };

interface PlayerManagerProps {
  session: SessionWithPlayers;
  player: Player;
}

export function PlayerManager({
  session: initialSession,
  player,
}: PlayerManagerProps) {
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

  // Ici on pourra switcher sur d'autres écrans selon le status (GameScreen, etc)
  const renderContent = () => {
    switch (session.status) {
      case "DRAFT":
      case "PUBLISHED":
        return <PlayerDraftScreen onLeave={handleLeave} />;
      case "OPEN":
        return (
          <PlayerOpenScreen
            session={session}
            player={player}
            onLeave={handleLeave}
          />
        );
      case "LOCKED":
        return (
          <PlayerLockedScreen
            session={session}
            player={player}
            onLeave={handleLeave}
          />
        );
      case "IN_PROGRESS":
        return <PlayerInProgressScreen session={session} player={player} />;
      case "FINISHED":
        return (
          <PlayerFinishedScreen
            session={session}
            player={player}
            onLeave={handleLeave}
          />
        );
      default:
        return <div>Status inconnu: {session.status}</div>;
    }
  };

  return (
    <>
      {renderContent()}

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
    </>
  );
}
