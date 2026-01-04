import { motion } from "framer-motion";
import { GameSession, Player } from "@prisma/client";
// On assumera qu'on aura un composant Scoreboard/Podium à l'avenir.
// Pour l'instant, titre simple.

export function FinishedScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-7xl font-black mb-8 text-yellow-300"
      >
        PARTIE TERMINÉE
      </motion.h1>
      <p className="text-3xl">Merci d&apos;avoir joué !</p>
    </div>
  );
}
