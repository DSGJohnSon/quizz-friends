import { motion } from "framer-motion";

interface InProgressScreenProps {
  displayTarget?: "DISPLAY_1" | "DISPLAY_2";
}

export function InProgressScreen({ displayTarget }: InProgressScreenProps) {
  if (displayTarget === "DISPLAY_2") {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {/* Empty state for D2 by default */}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <h2 className="text-6xl font-bold mb-4">Jeu en cours</h2>
        <p className="text-2xl opacity-75">Regardez l&apos;écran principal</p>
      </motion.div>
    </div>
  );
}
