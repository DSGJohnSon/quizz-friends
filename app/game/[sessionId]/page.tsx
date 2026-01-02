import { getSession } from "@/domain/session/session.service";
import { GameDisplay } from "@/components/game/game-display";
import { notFound } from "next/navigation";

export default async function GamePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    notFound();
  }

  return <GameDisplay session={session} />;
}
