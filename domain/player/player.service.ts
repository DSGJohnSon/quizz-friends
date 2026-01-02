import { prisma } from "@/lib/prisma";
import { assignPlayerColor } from "@/lib/utils/player-colors";
import { publishEvent } from "@/lib/supabase/realtime";

export async function joinSession(sessionId: string, name: string) {
  // Vérifier que la session accepte les inscriptions
  const session = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: { players: true },
  });

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.status !== "OPEN") {
    throw new Error("Session is not open for registration");
  }

  // Gérer les doublons de noms
  let finalName = name;
  let counter = 1;
  while (session.players.some((p) => p.name === finalName)) {
    finalName = `${name} (${counter})`;
    counter++;
  }

  // Assigner une couleur
  const color = assignPlayerColor(session.players.length);

  const player = await prisma.player.create({
    data: {
      sessionId,
      name: finalName,
      color,
      isConnected: true,
    },
  });

  await publishEvent(sessionId, "player:joined", { player });

  return player;
}

export async function disconnectPlayer(playerId: string) {
  const player = await prisma.player.update({
    where: { id: playerId },
    data: { isConnected: false },
  });

  await publishEvent(player.sessionId, "player:left", { player });

  return player;
}

export async function getPlayer(playerId: string) {
  return prisma.player.findUnique({
    where: { id: playerId },
    include: { session: true },
  });
}
