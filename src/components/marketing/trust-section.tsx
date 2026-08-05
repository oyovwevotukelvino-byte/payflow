// src/components/marketing/trust-section.tsx
"use client";

import { motion } from "framer-motion";
import { Scissors, Armchair, Briefcase, Laptop, Sparkles, Store, Shirt, Printer, UtensilsCrossed } from "lucide-react";
import { SectionContainer } from "./section-container";

const BUSINESS_TYPES = [
  { label: "Tailors", icon: Scissors },
  { label: "Fashion designers", icon: Shirt },
  { label: "Furniture makers", icon: Armchair },
  { label: "Agencies", icon: Briefcase },
   { label: "Printing businesses", icon: Printer },
  { label: "Freelancers", icon: Laptop },
  { label: "Beauty salons", icon: Sparkles },
  { label: "Retail stores", icon: Store },
   { label: "Caterers & event planners", icon: UtensilsCrossed }
] as const;

/**
 * Answers "who is this for?" with real, named archetypes rather than an
 * abstract "small businesses" claim — a Nigerian tailor or salon owner
 * should see themselves named directly, not implied.
 */
export function TrustSection() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <SectionContainer>
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for Nigerian business owners
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            From tailors to agencies, PayFlow adapts to how you already do business.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {BUSINESS_TYPES.map((type, index) => (
            <motion.div
              key={type.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-white p-6 text-center"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <type.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-foreground">{type.label}</span>
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}