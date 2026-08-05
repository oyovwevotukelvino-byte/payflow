// src/components/marketing/demo/stages/stage-whatsapp.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCheck, MessageCircle } from "lucide-react";

import { InvoiceCard } from "../invoice-card";
import { DEMO_INVOICE } from "../demo-data";
import { SOFT_SPRING } from "../demo-variants";

export function StageWhatsApp() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-4 sm:block">
      <motion.div
        layout
        transition={SOFT_SPRING}
        className="relative z-10 sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2"
      >
        <InvoiceCard compact />
      </motion.div>

      <motion.div
        layoutId="demo-whatsapp-panel"
        initial={{ opacity: 0, x: 40, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -20, scale: 0.96 }}
        transition={SOFT_SPRING}
        className="w-full overflow-hidden rounded-2xl border border-emerald-200 bg-[#efeae2] shadow-xl sm:ml-auto sm:w-[235px]"
      >
        <div className="flex items-center gap-2 bg-emerald-700 px-3 py-2.5 text-white">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </div>

          <div>
            <p className="text-[15px] font-semibold">
              Amara&apos;s Boutique
            </p>
            <p className="text-[10px] text-white/70">online</p>
          </div>
        </div>

        <div className="space-y-2 p-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="ml-auto max-w-[140px] rounded-xl rounded-tr-sm bg-[#d9fdd3] p-3 shadow-sm"
          >
            <p className="text-[12px] leading-relaxed text-slate-800">
              Hi Amara, your invoice for{" "}
              <strong>{DEMO_INVOICE.amount}</strong> is ready.
            </p>

            <div className="mt-2 rounded-md bg-white/70 px-2 py-1.5">
              <p className="truncate text-[8px] font-medium text-primary">
                {DEMO_INVOICE.paymentUrl}
              </p>
            </div>

            <div className="mt-1 flex items-center justify-end gap-1 text-[7px] text-slate-500">
              <span>9:41 PM</span>
              <CheckCheck
                className="h-3 w-3 text-sky-500"
                aria-label="Delivered"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
