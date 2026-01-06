"use client";

import { GameSession, Player } from "@prisma/client";
import { useDisplay } from "@/hooks/use-display";
import { DisplayState } from "@/domain/display/display.types";
import { DraftScreen } from "@/components/game/screens/draft-screen";
import { PublishedScreen } from "@/components/game/screens/published-screen";
import { OpenScreen } from "@/components/game/screens/open-screen";
import { LockedScreen } from "@/components/game/screens/locked-screen";
import { InProgressScreen } from "@/components/game/screens/in-progress-screen";
import { FinishedScreen } from "@/components/game/screens/finished-screen";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { GameLogo } from "@/components/game/game-logo";
import { APP_VERSION } from "@/lib/version";
import BgAnimated from "../bg-animated";

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

  const getLogoSize = () => {
    //DISPLAY 2 ONLY NEED BIG
    if (["OPEN", "LOCKED"].includes(session.status) && displayTarget === "DISPLAY_2") {
      return "BIG";
    }
    //DISPLAY 2 ONLY NEED MEDIUM
    if ([""].includes(session.status) && displayTarget === "DISPLAY_2") {
      return "MEDIUM";
    }
    //DISPLAY 2 ONLY NEED SMALL
    if ([""].includes(session.status) && displayTarget === "DISPLAY_2") {
      return "SMALL";
    }
    //---------------------
    //BIG
    if (["DRAFT", "IN_PROGRESS"].includes(session.status)) {
      return "BIG";
    }
    //MEDIUM
    if (["LOCKED"].includes(session.status)) {
      return "MEDIUM";
    }
    //SMALL
    return "SMALL";
  };

  const logoSize = getLogoSize();

  return (
    <div className="w-screen h-screen relative text-white overflow-hidden">
      <GameLogo size={logoSize} />
      <AnimatePresence mode="wait">
        <motion.div
          key={myView.type + session.status} // Clé pour déclencher l'animation
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="w-full h-screen z-50"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 text-xs mix-blend-difference text-white/10 font-mono text-right z-10">
        <div className="">{displayTarget}</div>
        <div>
          Status: {session.status} - v{APP_VERSION}
        </div>
      </div>
      <BgAnimated />
    </div>
  );
}
