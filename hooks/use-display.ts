import { useState, useEffect, useCallback } from "react";
import {
  DisplayState,
  DisplayInfo,
  DisplayTarget,
} from "@/domain/display/display.types";
import { useRealtimeSession } from "./use-realtime-session";
import { RealtimeEvent } from "@/lib/supabase/realtime";

const HEARTBEAT_INTERVAL = 5000;

export function useDisplay(
  sessionId: string,
  displayTarget: "DISPLAY_1" | "DISPLAY_2",
  initialState: DisplayState
) {
  const [displayState, setDisplayState] = useState<DisplayState>(initialState);

  // Écoute des mises à jour Realtime
  const handleRealtimeEvent = useCallback((event: RealtimeEvent) => {
    if (event.type === "display:updated") {
      setDisplayState(event.payload as unknown as DisplayState);
    }
  }, []);

  useRealtimeSession(sessionId, handleRealtimeEvent);

  // Heartbeat périodique ET Polling de sécurité
  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch(`/api/sessions/${sessionId}/display/heartbeat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: displayTarget }),
        });
      } catch (error) {
        console.error("Heartbeat failed", error);
      }
    };

    const fetchDisplayState = async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}/display`);
        const data = await res.json();
        if (data && !data.error) {
          // On utilise setState fonctionnel pour éviter boucle infinie mais ici on remplace tout
          setDisplayState(data);
        }
      } catch (error) {
        console.error("Polling display state failed", error);
      }
    };

    // Premier heartbeat immédiat
    sendHeartbeat();
    fetchDisplayState();

    const intervalHeartbeat = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    const intervalPolling = setInterval(fetchDisplayState, 2000); // Polling toutes les 2s

    return () => {
      clearInterval(intervalHeartbeat);
      clearInterval(intervalPolling);
    };
  }, [sessionId, displayTarget]);

  // Récupération de l'info spécifique à ce display avec fallback de sécurité
  const myDisplayInfo =
    displayTarget === "DISPLAY_1"
      ? displayState?.display1
      : displayState?.display2;

  // Fallback si myDisplayInfo est undefined (ex: race condition au chargement ou reset backend)
  const safeView = myDisplayInfo?.view || { type: "EMPTY" };

  return {
    displayState,
    myView: safeView,
  };
}
