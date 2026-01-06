import { useEffect } from "react";
import {
  subscribeToSession,
  unsubscribeFromSession,
  RealtimeEvent,
} from "@/lib/supabase/realtime";

export function useRealtimeSession(
  sessionId: string,
  onEvent: (event: RealtimeEvent) => void
) {
  useEffect(() => {
    const channel = subscribeToSession(sessionId, (payload) => {
      onEvent(payload as any);
    });

    return () => {
      unsubscribeFromSession(channel);
    };
  }, [sessionId, onEvent]);
}
