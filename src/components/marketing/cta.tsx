// src/components/marketing/cta.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "./section-container";

const FLOATING_CHIPS = [
  { label: "Amara's Boutique \u2014 \u20a645,000 received", top: "18%", left: "8%", delay: 0 },
  { label: "Tunde Furniture \u2014 paid", top: "68%", left: "72%", delay: 1.4 },
  { label: "Blessing Events \u2014 \u20a675,000 received", top: "40%", left: "80%", delay: 2.8 },
] as const;

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-[var(--pf-navy)] py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {FLOATING_CHIPS.map((chip) => (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: [0, 0.5, 0.5, 0], y: [12, 0, 0, -12] }}
            transition={{
              duration: 6,
              delay: chip.delay,
              repeat: Infinity,
              repeatDelay: 4,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ top: chip.top, left: chip.left }}
            className="absolute flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-white/60"
          >
            <CheckCircle2 className="h-3 w-3 text-[var(--success)]" aria-hidden="true" />
            {chip.label}
          </motion.div>
        ))}
      </div>

      <SectionContainer className="relative text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Start collecting payments today
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/70">
          No credit card. No setup calls. Just an invoice you can send in the next two minutes.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/sign-up">
            Create free account
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </SectionContainer>
    </section>
  );
}