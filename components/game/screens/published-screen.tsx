import { motion } from "framer-motion";

export function PublishedScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-black tracking-tighter mb-6"
      >
        QUIZ FRIENDS
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl opacity-75"
      >
        L&apos;ouverture des inscriptions va bientôt avoir lieu...
      </motion.p>
    </div>
  );
}
