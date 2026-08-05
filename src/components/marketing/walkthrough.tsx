// src/components/marketing/walkthrough.tsx
"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Link2,
  MessageCircle,
  Wallet,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { SectionContainer } from "./section-container";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: FileText,
    label: "You finish the job",
    description: "The last thing on your mind should be paperwork. PayFlow turns it into an invoice in seconds.",
  },
  {
    icon: Link2,
    label: "A payment link is ready",
    description: "No account number to type out. PayFlow generates a secure way to pay, automatically.",
  },
  {
    icon: MessageCircle,
    label: "It lands on WhatsApp",
    description: "Not buried in an inbox. Your customer sees it exactly where they already are.",
  },
  {
    icon: Wallet,
    label: "They tap once to pay",
    description: "No confusion about where the money should go, or whether it's really you asking.",
  },
  {
    icon: Bell,
    label: "If they forget, PayFlow remembers",
    description: "A reminder goes out on its own. You never have to send the awkward follow-up.",
  },
  {
    icon: CheckCircle2,
    label: "The moment money lands, you know",
    description: "No bank app to refresh. You find out the second Amara's customer pays.",
  },
] as const;

export function Walkthrough() {
  return (
    <section id="how-it-works" className="bg-background py-20 sm:py-28">
      <SectionContainer>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What happens after you hit send
          </h2>
          <p className="mt-4 text-muted-foreground">
           This is Amara&apos;s Boutique&apos;s invoice, start to finish. It works the same way for you
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-6 right-6 top-6 hidden h-px bg-border lg:block" />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-6 lg:gap-4">
            {STEPS.map((step, index) => {
              const isFinal = index === STEPS.length - 1;

              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex gap-4 lg:flex-col lg:items-center lg:gap-3 lg:text-center"
                >
                  {index < STEPS.length - 1 && (
                    <div className="absolute left-6 top-12 h-[calc(100%-1rem)] w-px bg-border lg:hidden" />
                  )}

                  <div
                    className={cn(
                      "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-background text-sm font-semibold",
                      isFinal
                        ? "border-[var(--success)] text-[var(--success)]"
                        : "border-border text-foreground"
                    )}
                  >
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <div className="pb-2 lg:pb-0">
                    <p className="text-sm font-medium text-foreground">
                      {String(index + 1).padStart(2, "0")}. {step.label}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground lg:max-w-[140px]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}