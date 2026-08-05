// src/components/marketing/demo/stages/stage-checkout.tsx
"use client";

import { motion } from "framer-motion";
import { CreditCard, LockKeyhole, Smartphone } from "lucide-react";

import { DEMO_INVOICE } from "../demo-data";
import { SOFT_SPRING } from "../demo-variants";

export function StageCheckout() {
  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        layoutId="demo-checkout-phone"
        initial={{ opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.96 }}
        transition={SOFT_SPRING}
        className="w-[230px] rounded-[2rem] border-[6px] border-slate-900 bg-slate-900 p-1 shadow-[0_20px_50px_rgba(15,23,42,0.3)]"
      >
        <div className="overflow-hidden rounded-[1.55rem] bg-slate-50">
          <div className="flex justify-center bg-white py-2">
            <div className="h-1.5 w-14 rounded-full bg-slate-200" />
          </div>

          <div className="space-y-4 p-4">
            <div className="text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Smartphone
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-2 text-[10px] font-medium text-foreground">
                Pay Amara&apos;s invoice
              </p>

              <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                {DEMO_INVOICE.amount}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-white p-3">
              <div className="flex items-center gap-2">
                <CreditCard
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />

                <div>
                  <p className="text-[9px] font-medium text-foreground">
                    Card or bank transfer
                  </p>
                  <p className="text-[8px] text-muted-foreground">
                    Choose how you want to pay
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              type="button"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(37,99,235,0)",
                  "0 0 0 6px rgba(37,99,235,0.10)",
                  "0 0 0 0 rgba(37,99,235,0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
              className="w-full rounded-lg bg-primary px-3 py-2.5 text-[10px] font-medium text-white"
            >
              Pay {DEMO_INVOICE.amount}
            </motion.button>

            <div className="flex items-center justify-center gap-1 text-[7px] text-muted-foreground">
              <LockKeyhole className="h-3 w-3" aria-hidden="true" />
              Secured by Paystack
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}