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
    (a, b) => b.totalScore - a.totalScore
  );

  const podium = sortedPlayers.slice(0, 3);
  const remaining = sortedPlayers.slice(3);

  const getPodiumStyle = (index: number) => {
    switch (index) {
      case 0:
        return "from-yellow-400 to-yellow-600 border-yellow-300 scale-110 z-10 shadow-yellow-500/20";
      case 1:
        return "from-slate-300 to-slate-500 border-slate-200 scale-100 shadow-slate-500/20";
      case 2:
        return "from-amber-600 to-amber-800 border-amber-500 scale-95 shadow-amber-500/20";
      default:
        return "";
    }
  };

  const getPodiumLabel = (index: number) => {
    switch (index) {
      case 0:
        return "🥇 1er";
      case 1:
        return "🥈 2ème";
      case 2:
        return "🥉 3ème";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-black p-4 flex flex-col items-center">
      <div className="max-w-4xl w-full pt-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-2 uppercase tracking-tighter italic animate-bounce-subtle">
            Le Podium !
          </h1>
          <p className="text-indigo-300 font-medium">
            {session.title} •{" "}
            {new Date(
              session.finishedAt || session.updatedAt
            ).toLocaleDateString()}
          </p>
        </div>

        {/* Podium Section */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-20 px-4">
          {podium[1] && (
            <div className="order-2 md:order-1 flex flex-col items-center w-full md:w-48">
              <div
                className={`w-full p-6 rounded-t-2xl bg-linear-to-b border-t-4 flex flex-col items-center text-white shadow-2xl ${getPodiumStyle(
                  1
                )}`}
              >
                <div
                  className="w-16 h-16 rounded-full border-4 border-white/50 mb-3"
                  style={{ backgroundColor: podium[1].color }}
                />
                <span className="font-bold text-center line-clamp-1">
                  {podium[1].name}
                </span>
                <span className="text-3xl font-black mt-2">
                  {podium[1].totalScore}
                </span>
              </div>
              <div className="bg-white/5 w-full py-2 text-center text-white/50 text-xs font-bold uppercase rounded-b-xl border border-white/10">
                {getPodiumLabel(1)}
              </div>
            </div>
          )}

          {podium[0] && (
            <div className="order-1 md:order-2 flex flex-col items-center w-full md:w-56 mb-4 md:mb-8">
              <div
                className={`w-full p-8 rounded-t-2xl bg-linear-to-b border-t-4 flex flex-col items-center text-white shadow-2xl ${getPodiumStyle(
                  0
                )}`}
              >
                <div
                  className="w-20 h-20 rounded-full border-4 border-white/50 mb-4"
                  style={{ backgroundColor: podium[0].color }}
                />
                <span className="text-xl font-bold text-center line-clamp-1">
                  {podium[0].name}
                </span>
                <span className="text-5xl font-black mt-2">
                  {podium[0].totalScore}
                </span>
              </div>
              <div className="bg-white/15 w-full py-3 text-center text-white font-bold uppercase rounded-b-xl border border-white/20 backdrop-blur-sm">
                {getPodiumLabel(0)}
              </div>
            </div>
          )}

          {podium[2] && (
            <div className="order-3 flex flex-col items-center w-full md:w-44">
              <div
                className={`w-full p-4 rounded-t-2xl bg-linear-to-b border-t-4 flex flex-col items-center text-white shadow-2xl ${getPodiumStyle(
                  2
                )}`}
              >
                <div
                  className="w-14 h-14 rounded-full border-4 border-white/50 mb-2"
                  style={{ backgroundColor: podium[2].color }}
                />
                <span className="font-bold text-sm text-center line-clamp-1">
                  {podium[2].name}
                </span>
                <span className="text-2xl font-black mt-1">
                  {podium[2].totalScore}
                </span>
              </div>
              <div className="bg-white/5 w-full py-2 text-center text-white/50 text-xs font-bold uppercase rounded-b-xl border border-white/10">
                {getPodiumLabel(2)}
              </div>
            </div>
          )}
        </div>

        {/* List Section for others */}
        {remaining.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4 text-center">
              Le reste du classement
            </h3>
            {remaining.map((player, index) => (
              <Card
                key={player.id}
                className="p-3 bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-white/40 italic">
                    #{index + 4}
                  </div>
                  <div
                    className="w-8 h-8 rounded-full border border-white/20"
                    style={{ backgroundColor: player.color }}
                  />
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white/90">
                      {player.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-white tabular-nums">
                      {player.totalScore}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-20 text-center text-white/40 text-sm">
          <p>Merci d'avoir joué à Quiz Friends !</p>
        </div>
      </div>
      <VersionDisplay />
    </div>
  );
}
