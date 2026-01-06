"use client";

import { useCallback, useEffect, useState } from "react";
import { GameSession, Player } from "@prisma/client";
import { useRealtimeSession } from "@/hooks/use-realtime-session";
// import { HostControlPanel } from "./control-panel"; // Deprecated
import { HostLayout } from "./host-layout";
import { HostDraftScreen } from "./screens/draft-screen";
import { HostPublishedScreen } from "./screens/published-screen";
import { HostOpenScreen } from "./screens/open-screen";
import { HostLockedScreen } from "./screens/locked-screen";
import { HostInProgressScreen } from "./screens/in-progress-screen";
import { HostFinishedScreen } from "./screens/finished-screen";
import { DisplayState } from "@/domain/display/display.types";

type SessionWithPlayers = GameSession & { players: Player[] };

interface HostManagerProps {
  session: SessionWithPlayers;
  initialDisplayState: DisplayState;
}

export function HostManager({
  session: initialSession,
  initialDisplayState,
}: HostManagerProps) {
  const [session, setSession] = useState(initialSession);
  const [alerts, setAlerts] = useState<
    { id: string; message: string; type: "join" | "leave" }[]
  >([]);

  // Polling périodique pour vérifier la connectivité (toutes les 5s)
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/sessions/${session.id}?checkConnectivity=true`)
        .then((res) => res.json())
        .then(setSession)
        .catch(console.error);
    }, 3000);

    return () => clearInterval(interval);
  }, [session.id]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Synchronisation temps réel (sur événements spécifiques)
  const handleRealtimeEvent = useCallback(
    (event: any) => {
      // Recharger la session pour avoir les données fraîches
      fetch(`/api/sessions/${session.id}?checkConnectivity=true`)
        .then((res) => res.json())
        .then(setSession)
        .catch(console.error);

      // Gérer les alertes
      if (event.type === "player:left") {
        const id = Math.random().toString(36).substr(2, 9);
        setAlerts((prev) => [
          ...prev,
          {
            id,
            message: `${event.payload.player.name} s'est déconnecté`,
            type: "leave",
          },
        ]);
        setTimeout(() => removeAlert(id), 15000); // 15 secondes
      } else if (event.type === "player:joined" && event.payload.player) {
        // Uniquement si c'est une reconnexion
        const existingPlayer = session.players.find(
          (p) => p.id === event.payload.player.id
        );
        if (existingPlayer && !existingPlayer.isConnected) {
          const id = Math.random().toString(36).substr(2, 9);
          setAlerts((prev) => [
            ...prev,
            {
              id,
              message: `${event.payload.player.name} est de retour !`,
              type: "join",
            },
          ]);
          setTimeout(() => removeAlert(id), 5000); // 5 secondes pour le retour
        }
      }
    },
    [session.id, session.players, removeAlert]
  );

  useRealtimeSession(session.id, handleRealtimeEvent);

  // Actions
  const handleAction = async (action: string) => {
    try {
      const res = await fetch(`/api/sessions/${session.id}/${action}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Action ${action} failed`);
      const updated = await res.json();
      setSession(updated);
    } catch (err) {
      console.error(err);
      alert("Une erreur est survenue");
    }
  };

  const handleDisplayUpdate = async (body: any) => {
    try {
      await fetch(`/api/sessions/${session.id}/display`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: body,
          isDisplay2Available: true,
        }),
      });
      // On attend que le serveur mette à jour via le polling/event, ou on peut optimisfu
    } catch (e) {
      console.error(e);
    }
  };

  const [loading, setLoading] = useState(false);
  const wrapAction = (fn: () => Promise<void>) => async () => {
    setLoading(true);
    await fn();
    setLoading(false);
  };

  const renderScreen = () => {
    switch (session.status) {
      case "DRAFT":
        return (
          <HostDraftScreen
            session={session}
            onPublish={() => handleAction("publish")}
          />
        );
      case "PUBLISHED":
        return (
          <HostPublishedScreen
            session={session}
            onOpen={() => handleAction("open")}
          />
        );
      case "OPEN":
        return (
          <HostOpenScreen
            session={session}
            onLock={() => handleAction("lock")}
            onDraft={() => handleAction("draft")}
          />
        );
      case "LOCKED":
        return (
          <HostLockedScreen
            session={session}
            onStart={() => handleAction("start")}
            onOpen={() => handleAction("open")}
          />
        );
      case "IN_PROGRESS":
        return (
          <HostInProgressScreen
            session={session}
            displayState={initialDisplayState}
            onUpdateDisplay={handleDisplayUpdate}
            onFinish={() => handleAction("finish")}
          />
        );
      case "FINISHED":
        return <HostFinishedScreen session={session} />;
      default:
        return <div>Status inconnu: {session.status}</div>;
    }
  };

  return (
    <HostLayout session={session} alerts={alerts} onAlertDismiss={removeAlert}>
      {renderScreen()}
    </HostLayout>
  );
}
