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

  // Synchronisation temps réel
  const handleRealtimeEvent = useCallback(() => {
    fetch(`/api/sessions/${session.id}`)
      .then((res) => res.json())
      .then(setSession)
      .catch(console.error);
  }, [session.id]);

  useRealtimeSession(session.id, handleRealtimeEvent);

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
    </div>
  );
}
