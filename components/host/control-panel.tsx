"use client";

import { useCallback, useEffect, useState } from "react";
import { GameSession, Player } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRealtimeSession } from "@/hooks/use-realtime-session";
import { PlayerList } from "./player-list";

type SessionWithPlayers = GameSession & { players: Player[] };

export function HostControlPanel({
  session: initialSession,
}: {
  session: SessionWithPlayers;
}) {
  const [session, setSession] = useState(initialSession);
  const [loading, setLoading] = useState(false);
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
    [session.id, session.players]
  );

  useRealtimeSession(session.id, handleRealtimeEvent);

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  async function handlePublish() {
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${session.id}/publish`, {
        method: "POST",
      });
      const updated = await res.json();
      setSession(updated);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la publication");
    } finally {
      setLoading(false);
    }
  }

  async function handleLock() {
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${session.id}/lock`, {
        method: "POST",
      });
      const updated = await res.json();
      setSession(updated);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du verrouillage");
    } finally {
      setLoading(false);
    }
  }

  async function handleStart() {
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${session.id}/start`, {
        method: "POST",
      });
      const updated = await res.json();
      setSession(updated);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du démarrage");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar gauche: Joueurs */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">
          Joueurs ({session.players?.length || 0}/{session.expectedPlayerCount})
        </h2>
        <PlayerList players={session.players || []} />
      </Card>

      {/* Centre: État */}
      <Card className="p-6 lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{session.title}</h1>
          {session.description && (
            <p className="text-gray-600 mt-2">{session.description}</p>
          )}
          <div className="mt-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {session.status}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {session.status === "DRAFT" && (
            <Button
              onClick={handlePublish}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              Publier la session
            </Button>
          )}

          {(session.status === "PUBLISHED" || session.status === "OPEN") && (
            <>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Code de session:</p>
                <p className="text-3xl font-mono font-bold">{session.code}</p>
              </div>

              <Button
                onClick={handleLock}
                disabled={loading}
                size="lg"
                className="w-full"
              >
                Fermer les inscriptions
              </Button>
            </>
          )}

          {session.status === "LOCKED" && (
            <Button
              onClick={handleStart}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              Lancer le jeu
            </Button>
          )}

          {session.status === "IN_PROGRESS" && (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-lg font-semibold text-green-900">
                Jeu en cours
              </p>
              <p className="text-sm text-green-700 mt-2">
                Les modules de jeu seront implémentés dans la prochaine version
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Alertes flottantes */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`pointer-events-auto p-4 rounded-lg shadow-lg border-l-4 flex items-center justify-between min-w-[300px] animate-in slide-in-from-right duration-300 ${
              alert.type === "leave"
                ? "bg-red-50 border-red-500 text-red-800"
                : "bg-green-50 border-green-500 text-green-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {alert.type === "leave" ? "⚠️" : "👋"}
              </span>
              <p className="font-medium">{alert.message}</p>
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
