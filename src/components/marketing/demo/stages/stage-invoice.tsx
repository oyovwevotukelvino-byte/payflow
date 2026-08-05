// src/components/marketing/demo/stages/stage-invoice.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { InvoiceCard } from "../invoice-card";
import { fadeUp, SOFT_SPRING } from "../demo-variants";

export function StageInvoice() {
  return (
    <motion.div
      {...fadeUp}
      transition={SOFT_SPRING}
      className="flex h-full flex-col justify-center gap-3"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, ...SOFT_SPRING }}
        className="flex items-center gap-2 text-[11px] font-medium text-emerald-600"
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Invoice created
      </motion.div>

      <InvoiceCard />
    </motion.div>
  );
}