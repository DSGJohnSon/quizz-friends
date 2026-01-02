import { prisma } from "@/lib/prisma";
import { SessionStatus } from "@prisma/client";
import { generateSessionCode } from "@/lib/utils/session-code";
import { publishEvent } from "@/lib/supabase/realtime";

export async function createSession(data: {
  title: string;
  description?: string;
  expectedPlayerCount: number;
}) {
  const code = await generateSessionCode();

  const session = await prisma.gameSession.create({
    data: {
      ...data,
      code,
      status: "DRAFT",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expire dans 24h
    },
  });

  return session;
}

export async function publishSession(sessionId: string) {
  const session = await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  await publishEvent(sessionId, "session:published", { session });

  // Transition automatique vers OPEN
  return openSession(sessionId);
}

export async function openSession(sessionId: string) {
  const session = await prisma.gameSession.update({
    where: { id: sessionId },
    data: { status: "OPEN" },
  });

  await publishEvent(sessionId, "session:updated", { session });
  return session;
}

export async function lockSession(sessionId: string) {
  const session = await prisma.gameSession.update({
    where: { id: sessionId },
    data: { status: "LOCKED" },
  });

  await publishEvent(sessionId, "session:locked", { session });
  return session;
}

export async function startSession(sessionId: string) {
  const session = await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      status: "IN_PROGRESS",
      startedAt: new Date(),
    },
  });

  await publishEvent(sessionId, "session:started", { session });
  return session;
}

export async function finishSession(sessionId: string) {
  const session = await prisma.gameSession.update({
    where: { id: sessionId },
    data: {
      status: "FINISHED",
      finishedAt: new Date(),
    },
  });

  await publishEvent(sessionId, "session:finished", { session });
  return session;
}

export async function getSession(sessionId: string, checkConnectivity = false) {
  // Vérifier la connectivité des joueurs uniquement si demandé (par l'host généralement)
  if (checkConnectivity) {
    await checkPlayersConnectivity(sessionId);
  }

  return prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: {
      players: {
        orderBy: { joinedAt: "asc" },
      },
      modules: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getSessionByCode(code: string) {
  return prisma.gameSession.findUnique({
    where: { code },
    include: {
      players: {
        orderBy: { joinedAt: "asc" },
      },
    },
  });
}

async function checkPlayersConnectivity(sessionId: string) {
  const now = new Date();
  const timeout = 7 * 1000; // 7 secondes

  const disconnectedPlayers = await prisma.player.findMany({
    where: {
      sessionId,
      isConnected: true,
      lastActiveAt: {
        lt: new Date(now.getTime() - timeout),
      },
    },
  });

  if (disconnectedPlayers.length > 0) {
    await prisma.player.updateMany({
      where: {
        id: { in: disconnectedPlayers.map((p) => p.id) },
      },
      data: { isConnected: false },
    });

    // Publier un événement pour chaque joueur déconnecté
    for (const player of disconnectedPlayers) {
      await publishEvent(sessionId, "player:left", {
        player: { ...player, isConnected: false },
      });
    }
  }
}

export async function listSessions(status?: SessionStatus) {
  return prisma.gameSession.findMany({
    where: status ? { status } : undefined,
    include: {
      _count: {
        select: { players: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
