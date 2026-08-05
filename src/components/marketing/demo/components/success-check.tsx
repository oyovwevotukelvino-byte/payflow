"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SPRING } from "../demo-variants";

export function SuccessCheck() {
  return (
    <motion.div
      initial={{
        scale: 0.4,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={SPRING}
      className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success)]"
    >
      {/* expanding ring */}

      <motion.div
        initial={{
          scale: 0.8,
          opacity: 0.35,
        }}
        animate={{
          scale: 1.45,
          opacity: 0,
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeOut",
        }}
        className="absolute inset-0 rounded-full border-4 border-[var(--success)]"
      />

      {/* check */}

      <Check
        className="h-10 w-10 text-white"
        strokeWidth={3}
      />
    </motion.div>
  );
}