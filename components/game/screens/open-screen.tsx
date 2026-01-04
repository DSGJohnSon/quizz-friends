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
  // On détecte si D2 est présent via le hook useDisplay (qui peut nous donner l'info globale si on l'exposait)
  // Mais ici, on va simplifier :
  // D1 -> Affiche QR Code. (Option: Si on veut le split view automatique ici, il faudrait savoir si D2 est là).
  // D2 -> Affiche Player Grid.

  // Le user a dit : "D1 QR CODE (Ou QR Code + Joueurs si D2 absent)"
  // Pour l'instant on va faire simple : D1 = LOBBY (QR + Joueurs) par défaut c'est plus safe, ou juste QR.
  // Si on veut respecter strictement "QR Code" (et split si D2 absent), on a besoin de l'info de présence D2.
  // Cette info est dispo dans displayState.

  // NOTE: DisplayManager passe déjà 'initialDisplayState'. On pourrait l'utiliser.

  if (displayTarget === "DISPLAY_2") {
    return (
      <div className="h-full p-8">
        <h2 className="text-4xl font-bold text-center mb-8">
          Joueurs connectés
        </h2>
        <PlayerGrid players={session.players} />
      </div>
    );
  }

  // DISPLAY_1
  // On vérifie si D2 est 'actif' (heartbeat < 15s)
  // Il faut caster session.displayState car c'est un JsonValue dans Prisma
  const displayState = session.displayState as any;
  const d2LastHeartbeat = displayState?.display2?.lastHeartbeat;
  const isD2Active = d2LastHeartbeat && Date.now() - d2LastHeartbeat < 15000;

  if (isD2Active) {
    // D2 est là pour afficher les joueurs, donc D1 affiche juste le QR gros
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <h2 className="text-4xl font-bold mb-8">Rejoignez la partie !</h2>
        <div className="scale-150 transform">
          <QRCodeDisplay sessionId={session.id} code={session.code} />
        </div>
      </div>
    );
  }

  // Fallback: Pas de D2 détecté, on affiche le Split View (QR + Players)
  return (
    <div className="grid grid-cols-2 gap-8 h-full items-center p-8">
      <div className="flex flex-col items-center justify-center border-r border-white/20">
        <h2 className="text-3xl font-bold mb-8">Rejoignez la partie !</h2>
        <div className="scale-125 transform">
          <QRCodeDisplay sessionId={session.id} code={session.code} />
        </div>
      </div>
      <div className="h-full overflow-y-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Joueurs</h2>
        <PlayerGrid players={session.players} />
      </div>
    </div>
  );
}
