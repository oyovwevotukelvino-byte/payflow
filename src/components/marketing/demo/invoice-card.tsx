// src/components/marketing/demo/invoice-card.tsx
"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { DEMO_INVOICE } from "./demo-data";
import { SPRING } from "./demo-variants";

type InvoiceCardProps = {
  compact?: boolean;
  className?: string;
};

export function InvoiceCard({
  compact = false,
  className,
}: InvoiceCardProps) {
  return (
    <motion.article
      layoutId="demo-invoice-card"
      transition={SPRING}
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-white shadow-sm",
        compact ? "w-[210px]" : "w-full",
        className
      )}
    >
      <div className="flex items-start justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FileText
              className="h-4 w-4 text-primary"
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-foreground">
              PayFlow
            </p>
            <p className="text-[9px] text-muted-foreground">
              Invoice {DEMO_INVOICE.number}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-medium text-amber-700">
          {DEMO_INVOICE.status}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
            Customer
          </p>
          <p className="mt-1 text-xs font-medium text-foreground">
            {DEMO_INVOICE.customer}
          </p>
        </div>

        {!compact && (
          <div>
            <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
              Description
            </p>
            <p className="mt-1 text-xs text-foreground">
              {DEMO_INVOICE.item}
            </p>
          </div>
        )}

        <div className="flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-[9px] text-muted-foreground">
              {DEMO_INVOICE.dueDate}
            </p>
            <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              {DEMO_INVOICE.amount}
            </p>
          </div>

          {!compact && (
            <div className="rounded-lg bg-primary px-3 py-2 text-[10px] font-medium text-white">
              Send invoice
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}