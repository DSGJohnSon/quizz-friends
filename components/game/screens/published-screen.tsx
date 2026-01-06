import { motion } from "framer-motion";
import { LucideLoaderCircle } from "lucide-react";

export function PublishedScreen() {
  return (
    <div className="h-screen w-screen relative">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-0 left-0 text-[#462255] text-3xl uppercase mb-4 ml-8 flex items-center"
      >
        <LucideLoaderCircle className="mr-4 size-8 animate-spin" />
        Lancement de la session...
      </motion.p>
    </div>
  );
}
