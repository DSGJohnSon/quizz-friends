"use client";

import { useCallback, useEffect, useState } from "react";
import { GameSession, Player } from "@prisma/client";
import { useRealtimeSession } from "@/hooks/use-realtime-session";
import { QRCodeDisplay } from "./qr-code-display";
import { PlayerGrid } from "./player-grid";
import { VersionDisplay } from "@/components/version-display";

type SessionWithPlayers = GameSession & { players: Player[] };

export function GameDisplay({
  session: initialSession,
}: {
  session: SessionWithPlayers;
}) {
  const [session, setSession] = useState(initialSession);

  const handleRealtimeEvent = useCallback(() => {
    fetch(`/api/sessions/${session.id}`)
      .then((res) => res.json())
      .then(setSession)
      .catch(console.error);
  }, [session.id]);

  useRealtimeSession(session.id, handleRealtimeEvent);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-blue-600 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8">{session.title}</h1>

        {session.status === "OPEN" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center">
              <QRCodeDisplay sessionId={session.id} code={session.code} />
            </div>
            <div>
              <h2 className="text-3xl font-semibold mb-4">Joueurs connectés</h2>
              <PlayerGrid players={session.players} />
            </div>
          </div>
        )}

        {session.status === "LOCKED" && (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold mb-4">Le jeu va commencer !</h2>
            <p className="text-xl opacity-90">Préparez-vous...</p>
            <div className="mt-8">
              <PlayerGrid players={session.players} />
            </div>
          </div>
        )}

        {session.status === "IN_PROGRESS" && (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold">Jeu en cours</h2>
            <p className="text-xl opacity-90 mt-4">
              Les modules de jeu seront disponibles dans la prochaine version
            </p>
          </div>
        )}

        {session.status === "FINISHED" && (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold">Jeu terminé !</h2>
            <p className="text-xl opacity-90 mt-4">Merci d&apos;avoir joué</p>
          </div>
        )}
      </div>
      <VersionDisplay />
    </div>
  );
}
