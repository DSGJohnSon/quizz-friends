import { supabase } from "./client";
import { RealtimeChannel } from "@supabase/supabase-js";

// Types d'événements
export type RealtimeEventType =
  | "session:updated"
  | "session:published"
  | "session:locked"
  | "session:started"
  | "session:finished"
  | "player:joined"
  | "player:left"
  | "player:score_updated"
  | "display:updated";

export interface RealtimeEvent {
  type: RealtimeEventType;
  sessionId: string;
  payload: any;
  timestamp: string;
}

// Publier un événement
export async function publishEvent(
  sessionId: string,
  type: RealtimeEventType,
  payload: any
) {
  const channel = supabase.channel(`session:${sessionId}`);
  await channel.send({
    type: "broadcast",
    event: type,
    payload: {
      type,
      sessionId,
      payload,
      timestamp: new Date().toISOString(),
    },
  });
}

// S'abonner aux événements d'une session
export function subscribeToSession(
  sessionId: string,
  callback: (event: RealtimeEvent) => void
): RealtimeChannel {
  const channel = supabase.channel(`session:${sessionId}`);

  channel
    .on("broadcast", { event: "*" }, ({ payload }) => {
      callback(payload as RealtimeEvent);
    })
    .subscribe();

  return channel;
}

// Se désabonner
export async function unsubscribeFromSession(channel: RealtimeChannel) {
  await supabase.removeChannel(channel);
}
