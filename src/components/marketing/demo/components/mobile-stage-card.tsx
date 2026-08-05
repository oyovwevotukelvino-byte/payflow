"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MobileStageCardProps {
  step: number;
  total: number;
  title: string;
  description: string;
  children: ReactNode;
}

export function MobileStageCard({
  step,
  total,
  title,
  description,
  children,
}: MobileStageCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="rounded-3xl border border-border bg-card p-6 shadow-sm"
    >
      {/* Progress */}

      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          Step {step} of {total}
        </span>

        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < step
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="mt-8 flex justify-center">
        {children}
      </div>
    </motion.article>
  );
}