"use client";

import { GameSession } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type SessionWithCount = GameSession & {
  _count: {
    players: number;
  };
};

export function SessionList({ sessions }: { sessions: SessionWithCount[] }) {
  if (sessions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500">Aucune session créée pour le moment</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {sessions.map((session) => (
        <Card key={session.id} className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{session.title}</h3>
              {session.description && (
                <p className="text-gray-600 mb-3">{session.description}</p>
              )}
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="inline-block px-3 py-1 bg-gray-100 rounded-full font-medium">
                  {session.status}
                </span>
                <span>
                  Joueurs: {session._count.players}/
                  {session.expectedPlayerCount}
                </span>
                {session.code && (
                  <span className="font-mono font-bold">
                    Code: {session.code}
                  </span>
                )}
              </div>
            </div>
            <Link href={`/host/${session.id}`}>
              <Button>Gérer</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
