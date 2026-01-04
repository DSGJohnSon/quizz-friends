"use client";

import { GameSession, Player } from "@prisma/client";
import { useDisplay } from "@/hooks/use-display";
import { DisplayState } from "@/domain/display/display.types";
import { QRCodeDisplay } from "@/components/game/qr-code-display";
import { PlayerGrid } from "@/components/game/player-grid";
import { VersionDisplay } from "@/components/version-display";
import { DraftScreen } from "@/components/game/screens/draft-screen";
import { PublishedScreen } from "@/components/game/screens/published-screen";
import { OpenScreen } from "@/components/game/screens/open-screen";
import { LockedScreen } from "@/components/game/screens/locked-screen";
import { InProgressScreen } from "@/components/game/screens/in-progress-screen";
import { FinishedScreen } from "@/components/game/screens/finished-screen";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useRealtimeSession } from "@/hooks/use-realtime-session";
import { RealtimeEvent } from "@/lib/supabase/realtime";

type SessionWithPlayers = GameSession & { players: Player[] };

interface DisplayManagerProps {
  session: SessionWithPlayers;
  initialDisplayState: DisplayState;
  displayTarget: "DISPLAY_1" | "DISPLAY_2";
}

export function DisplayManager({
  session: initialSession,
  initialDisplayState,
  displayTarget,
}: DisplayManagerProps) {
  const [session, setSession] = useState(initialSession);
  const { myView } = useDisplay(session.id, displayTarget, initialDisplayState);

  // Mise à jour de la session via le hook useDisplay ou useRealtimeSession
  // On écoute les événements de session pour mettre à jour l'état local
  // NOTE: useDisplay écoute déjà les events 'display:updated'.
  // Ici on veut écouter 'session:updated', 'session:locked', etc.

  const handleSessionEvent = (event: any) => {
    if (event.type.startsWith("session:") && event.payload.session) {
      setSession(event.payload.session);
    }
    // Mises à jour partielles (joueurs)
    if (event.type === "player:joined" || event.type === "player:left") {
      // Pour avoir la liste complète à jour, l'idéal est de re-fetch ou que le payload contienne la liste.
      // Actuellement le payload ne contient que le joueur.
      // Simplification : On refetch la session complète pour être sûr.
      fetch(`/api/sessions/${session.id}?checkConnectivity=false`)
        .then((res) => res.json())
        .then(setSession)
        .catch(console.error);
    }
  };

  const {
    useRealtimeSession: listenSession,
  } = require("@/hooks/use-realtime-session");
  listenSession(session.id, handleSessionEvent);

  // Fonction de rendu du contenu principal
  const renderContent = () => {
    // 1. Gestion des Vues Explicites (définies par l'Host)
    // 1. Gestion des Vues Explicites (définies par l'Host)
    if (myView.type === "LOBBY") {
      // Sur Display 2, "LOBBY" signifie juste la liste des joueurs
      if (displayTarget === "DISPLAY_2") {
        return (
          <div className="h-full p-8 overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Joueurs</h2>
            <PlayerGrid players={session.players} />
          </div>
        );
      }

      // Sur Display 1 (ou Auto), on affiche la vue complète
      return (
        <div className="grid grid-cols-2 gap-8 h-full items-center p-8">
          <div className="flex flex-col items-center justify-center border-r border-white/20">
            <h2 className="text-3xl font-bold mb-8">Rejoignez la partie !</h2>
            <QRCodeDisplay sessionId={session.id} code={session.code} />
          </div>
          <div className="h-full overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Joueurs</h2>
            <PlayerGrid players={session.players} />
          </div>
        </div>
      );
    }

    if (myView.type === "SCOREBOARD") {
      return (
        <div className="h-full flex items-center justify-center">
          <h2 className="text-4xl">Tableau des scores (À venir)</h2>
        </div>
      );
    }

    // 2. Fallback: Vue par défaut selon le statut de la session (si EMPTY)
    // C'est ici qu'on gère l'écran d'attente générique ou le jeu en cours
    return renderDefaultSessionView();
  };

  const renderDefaultSessionView = () => {
    switch (session.status) {
      case "DRAFT":
        return <DraftScreen />;
      case "PUBLISHED":
        return <PublishedScreen />;
      case "OPEN":
        return <OpenScreen session={session} displayTarget={displayTarget} />;
      case "LOCKED":
        return <LockedScreen session={session} displayTarget={displayTarget} />;
      case "IN_PROGRESS":
        return <InProgressScreen displayTarget={displayTarget} />;
      case "FINISHED":
        return <FinishedScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-blue-600 text-white overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={myView.type + session.status} // Clé pour déclencher l'animation
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="w-full h-screen"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 text-xs opacity-50 font-mono text-right">
        <div>{displayTarget}</div>
        <div>Status: {session.status}</div>
      </div>
      <VersionDisplay />
    </div>
  );
}
