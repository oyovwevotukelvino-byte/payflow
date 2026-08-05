// components/marketing/demo/stages/stage-builder.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SPRING } from "../demo-variants";

const CUSTOMER_NAME = "Amara's Boutique";
const AMOUNT = "\u20a645,000";

/**
 * Stage 2 — fields "type" themselves in sequence rather than appearing
 * all at once. layoutId="invoice-card" on the outer card is what lets
 * this exact element morph into Stage 3's generated invoice — same DOM
 * identity, different content, Framer animates the transform between them.
 */
export function StageBuilder() {
  const [typedCustomer, setTypedCustomer] = useState(false);
  const [typedAmount, setTypedAmount] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setTypedCustomer(true), 300);
    const t2 = setTimeout(() => setTypedAmount(true), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      layoutId="demo-invoice-card"
      transition={SPRING}
      className="flex h-full flex-col gap-3 rounded-xl border border-border bg-white p-4"
    >
      <p className="text-xs font-medium text-muted-foreground">New invoice</p>

      <div className="space-y-2">
        <div className="rounded-md border border-border px-3 py-2 text-xs text-foreground">
          {typedCustomer ? CUSTOMER_NAME : (
            <span className="text-muted-foreground/50">Customer name</span>
          )}
        </div>
        <div className="rounded-md border border-border px-3 py-2 text-xs text-foreground">
          {typedAmount ? AMOUNT : (
            <span className="text-muted-foreground/50">Amount</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}