import { getSession } from "@/domain/session/session.service";
import { getPlayer } from "@/domain/player/player.service";
import { PlayerManager } from "@/components/player/player-manager";
import { notFound } from "next/navigation";

export default async function PlayerSessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ playerId?: string }>;
}) {
  const { sessionId } = await params;
  const { playerId } = await searchParams;

  if (!playerId) {
    notFound();
  }

  const [session, player] = await Promise.all([
    getSession(sessionId),
    getPlayer(playerId),
  ]);

  if (!session || !player) {
    notFound();
  }

  return <PlayerManager session={session} player={player} />;
}
