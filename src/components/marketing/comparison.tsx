// src/components/marketing/comparison.tsx
"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { SectionContainer } from "./section-container";

const COMPARISON_ROWS = [
  { without: "Send your account number and hope they don't lose it", withFlow: "Share a payment link that just works" },
  { without: "Forget who still owes you money", withFlow: "PayFlow reminds them automatically" },
  { without: "Check your bank app, transfer by transfer", withFlow: "See who's paid the moment it happens" },
  { without: "Send a screenshot that looks like anyone could've made it", withFlow: "Send a branded invoice that looks like you mean business" },
  { without: "Chase customers yourself, again and again", withFlow: "Let PayFlow do the following up" },
] as const;

/**
 * Merges what were two separate sections in the original brief
 * (Comparison + Nigerian pain-points) — both answered the same question,
 * and running them back-to-back would repeat the same argument twice.
 */
export function Comparison() {
  return (
    <section id="comparison" className="bg-background py-20 sm:py-28">
      <SectionContainer>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            This is how Amara used to do it
          </h2>
          <p className="mt-4 text-muted-foreground">
            And how her boutique runs now.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-1 bg-muted/40 text-sm font-semibold sm:grid-cols-2"> 
            <div className="border-b border-border px-5 py-3 text-muted-foreground sm:border-b-0 sm:border-r">
              Without PayFlow
            </div>
            <div className="px-5 py-3 text-primary">With PayFlow</div>
          </div>

          {COMPARISON_ROWS.map((row, index) => (
            <motion.div
              key={row.without}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 border-t border-border text-sm"
            >
              <div className="flex items-start gap-2 border-r border-border px-5 py-4 text-muted-foreground">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden="true" />
                {row.without}
              </div>
              <div className="flex items-start gap-2 px-5 py-4 text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" aria-hidden="true" />
                {row.withFlow}
              </div>
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}