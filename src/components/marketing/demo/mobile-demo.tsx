"use client";

import type { ReactNode } from "react";
import {
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";

import { ChevronDown } from "lucide-react";

import { SectionContainer } from "../section-container";
import { DemoShell } from "./demo-shell";
import { DEMO_STAGES } from "./stage-definitions";

interface MobileStageCardProps {
  step: number;
  total: number;
  title: string;
  description: string;
  children: ReactNode;
}

export function MobileDemo() {
  return (
    <section
      id="demo"
      className="relative overflow-hidden bg-[var(--pf-navy)] py-20 sm:py-28"
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[260px] w-[260px] rounded-full bg-sky-500/10 blur-[120px]" />

        <div className="absolute left-0 top-1/2 h-[220px] w-[220px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <SectionContainer className="relative z-10">
        {/* Heading */}

        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold tracking-wide text-primary">
            THE EASIEST PART OF GETTING PAID
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
            Watch what happens after you send an invoice.
          </h2>

          <p className="mt-5 text-base leading-7 text-white/70">
            Every step happens automatically—from WhatsApp delivery
            to payment confirmation—so you spend less time chasing
            payments and more time running your business.
          </p>
        </div>

        {/* Swipe Hint */}

        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{
            opacity: [0.4, 1, 0.4],
            y: [0, 6, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="mt-10 flex items-center justify-center gap-2 text-sm text-white/60"
        >
          <ChevronDown className="h-4 w-4" />
          Swipe down to follow the journey
        </motion.div>

        {/* Timeline */}

        <div className="mt-12 flex w-full justify-center">
          <div className="w-full max-w-md space-y-10">
            {DEMO_STAGES.map(
              ({ Component, label, description }, index) => (
                <MobileStageCard
                  key={label}
                  step={index + 1}
                  total={DEMO_STAGES.length}
                  title={label}
                  description={description}
                >
                  <Component />
                </MobileStageCard>
              )
            )}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
}

function MobileStageCard({
  step,
  total,
  title,
  description,
  children,
}: MobileStageCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      initial={
        prefersReducedMotion
          ? false
          : {
              opacity: 0,
              y: 35,
            }
      }
      whileInView={
        prefersReducedMotion
          ? undefined
          : {
              opacity: 1,
              y: 0,
            }
      }
      whileHover={{
        y: -4,
      }}
      whileTap={{
        scale: 0.99,
      }}
      viewport={{
        once: true,
        amount: 0.25,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.30)]"
    >
      {/* Card Header */}

      <div className="border-b border-border px-5 py-5">
        <div
          className="flex gap-1.5"
          aria-label={`Step ${step} of ${total}`}
        >
          {Array.from({ length: total }, (_, index) => (
            <motion.span
              key={index}
              initial={prefersReducedMotion ? false : { scaleX: 0 }}
              whileInView={
                prefersReducedMotion ? undefined : { scaleX: 1 }
              }
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className={
                index < step
                  ? "h-1.5 flex-1 origin-left rounded-full bg-primary"
                  : "h-1.5 flex-1 rounded-full bg-muted"
              }
            />
          ))}
        </div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
          whileInView={
            prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
          }
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        >
          Step {step} of {total}
        </motion.p>

        <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Demo UI */}

      <div className="flex items-center justify-center bg-gradient-to-b from-white to-muted/30 p-4">
        <DemoShell>
          <LayoutGroup id={`mobile-demo-stage-${step}`}>
            {children}
          </LayoutGroup>
        </DemoShell>
      </div>
    </motion.article>
  );
}
