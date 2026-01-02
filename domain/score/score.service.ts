import { prisma } from "@/lib/prisma";
import { publishEvent } from "@/lib/supabase/realtime";

/**
 * Attribue des points à un joueur.
 * Cette opération est atomique : elle crée une entrée ScoreEntry et incrémente le totalScore du joueur.
 */
export async function awardPoints(
  playerId: string,
  points: number,
  reason: string
) {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Créer l'entrée de score
    const scoreEntry = await tx.scoreEntry.create({
      data: {
        playerId,
        points,
        reason,
      },
      include: {
        player: true,
      },
    });

    // 2. Mettre à jour le score total du joueur
    const updatedPlayer = await tx.player.update({
      where: { id: playerId },
      data: {
        totalScore: {
          increment: points,
        },
      },
    });

    return { scoreEntry, updatedPlayer };
  });

  // 3. Publier l'événement temps réel
  await publishEvent(result.updatedPlayer.sessionId, "player:score_updated", {
    playerId,
    points,
    reason,
    totalScore: result.updatedPlayer.totalScore,
  });

  return result;
}

/**
 * Récupère l'historique des scores d'un joueur.
 */
export async function getPlayerScoreHistory(playerId: string) {
  return prisma.scoreEntry.findMany({
    where: { playerId },
    orderBy: { createdAt: "desc" },
  });
}
