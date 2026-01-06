"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface GameLogoProps {
  size: "BIG" | "MEDIUM" | "SMALL";
}

export function GameLogo({ size }: GameLogoProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        top: size === "BIG" ? "50%" : "3rem",
        y: size === "BIG" ? "-50%" : "0%",
        width: size === "BIG" ? 800 : size === "MEDIUM" ? 600 : 200,
      }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1], // Smooth ease-out
      }}
      style={{
        left: "50%",
        x: "-50%",
        position: "absolute",
        zIndex: 60, // Above content (50)
      }}
      className="pointer-events-none"
    >
      <div className="relative w-full aspect-21/9">
        <Image
          src="/assets/logo/grand_concours_tantis_logo_upscaled.png"
          alt="Grand Concours Tantis"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>
    </motion.div>
  );
}
