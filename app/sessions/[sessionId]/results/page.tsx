import { getSession } from "@/domain/session/session.service";
import { Card } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { VersionDisplay } from "@/components/version-display";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    notFound();
  }

  const sortedPlayers = [...session.players].sort(
    (a, b) => b.joinedAt.getTime() - a.joinedAt.getTime()
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-black p-4 flex flex-col items-center">
      <div className="max-w-4xl w-full pt-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">
            Résultats Finaux
          </h1>
          <p className="text-indigo-300 font-medium">
            {session.title} •{" "}
            {new Date(
              session.finishedAt || session.updatedAt
            ).toLocaleDateString()}
          </p>
        </div>

        <div className="grid gap-4">
          {sortedPlayers.map((player, index) => (
            <Card
              key={player.id}
              className="p-4 bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 flex items-center justify-center font-black text-2xl text-white italic">
                  #{index + 1}
                </div>
                <div
                  className="w-10 h-10 rounded-full border-2 border-white/50"
                  style={{ backgroundColor: player.color }}
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:translate-x-1 transition-transform">
                    {player.name}
                  </h3>
                  <p className="text-sm text-white/50">Score: --- (v2)</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                      player.isConnected
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {player.isConnected ? "Present" : "Absent"}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center text-white/40 text-sm">
          <p>Merci d'avoir joué à Quiz Friends !</p>
        </div>
      </div>
      <VersionDisplay />
    </div>
  );
}
