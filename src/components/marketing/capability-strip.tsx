// src/components/marketing/capability-strip.tsx
"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionContainer } from "./section-container";

const CAPABILITIES = [
  "WhatsApp-first invoicing",
  "Nigerian bank transfers via Paystack",
  "Automatic payment reminders",
  "Real-time payment tracking",
  "Mobile-friendly, no app install",
  "Branded, professional invoices",
] as const;

/**
 * Replaces fabricated usage stats (invoice counts, revenue collected,
 * "trusted by X businesses") with honest, verifiable capability claims.
 * Every item here is true today, not a projection or invented metric.
 */
export function CapabilityStrip() {
  return (
    <section className="border-y border-border bg-muted/30 py-10">
      <SectionContainer>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CAPABILITIES.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-foreground"
            >
              <Check className="h-3.5 w-3.5 text-[var(--success)]" aria-hidden="true" />
              {item}
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}