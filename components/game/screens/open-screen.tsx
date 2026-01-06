import { motion } from "framer-motion";
import { GameSession, Player } from "@prisma/client";
import { QRCodeDisplay } from "@/components/game/qr-code-display";
import { PlayerGrid } from "@/components/game/player-grid";
import { useDisplay } from "@/hooks/use-display";

interface OpenScreenProps {
  session: GameSession & { players: Player[] };
  displayTarget: "DISPLAY_1" | "DISPLAY_2";
}

export function OpenScreen({ session, displayTarget }: OpenScreenProps) {
  if (displayTarget === "DISPLAY_2") {
    return null;
  }

  return (
    <div className="w-screen h-screen pt-45 px-32 pb-24 flex gap-32">
      <div className="w-1/2  flex flex-col items-center justify-between">
        <div className="w-2/3 mx-auto">
          <QRCodeDisplay sessionId={session.id} code={session.code} />
        </div>
        <div className="w-full bg-gray-900/50 border border-gray-600/50 rounded-xl p-6">
          <h2 className="text-3xl font-bold text-center mb-2">
            Rejoignez la partie !
          </h2>
          <div className="flex flex-col items-center gap-1">
            <p className="text-center">
              Scannez le QR Code ci-dessus ou rendez-vous sur :
            </p>
            <p className="text-center px-6 py-1 pb-2 bg-linear-to-r from-[#462255] to-[#ef6351] rounded-xl inline-block">
              quizz.fredf.fr/{session.code}
            </p>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full overflow-y-auto flex flex-col gap-12">
        <div className="flex items-center gap-4">
          <div className="block w-full h-[2px] bg-white"></div>
          <h2 className="text-3xl font-bold text-center mb-1 uppercase">Candidats</h2>
          <div className="block w-full h-[2px] bg-white"></div>
        </div>
        <PlayerGrid players={session.players} />
      </div>
    </div>
  );
}
