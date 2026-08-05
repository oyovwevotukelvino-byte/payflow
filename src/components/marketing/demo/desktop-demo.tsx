"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";

import { SectionContainer } from "../section-container";
import { DemoShell } from "./demo-shell";
import { DEMO_STAGES } from "./stage-definitions";
import { useDemoStage } from "./use-demo-stage";

/** Scroll-linked desktop presentation of the PayFlow product flow. */
export function DesktopDemo() {
  const prefersReducedMotion = useReducedMotion();
  const { containerRef, stage, heightVh } = useDemoStage(DEMO_STAGES.length);
  const resolvedStage = prefersReducedMotion ? DEMO_STAGES.length - 1 : stage;
  const ActiveStage = DEMO_STAGES[resolvedStage].Component;

  return (
    <section id="demo" className="bg-[var(--pf-navy)]">
      <SectionContainer className="pt-20 sm:pt-28">
        <DemoIntro />
      </SectionContainer>

      <div
        ref={containerRef}
        className="relative"
        style={{ height: prefersReducedMotion ? "100vh" : `${heightVh}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center">
          <SectionContainer className="grid w-full grid-cols-[0.75fr_1.25fr] items-center gap-16">
            <div className="space-y-6">
              {DEMO_STAGES.map((item, index) => {
                const isActive = index === resolvedStage;

                return (
                  <div key={item.label}>
                    <p
                      className={
                        isActive
                          ? "text-base font-medium text-white"
                          : "text-base text-white/30"
                      }
                    >
                      {item.label}
                    </p>

                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 max-w-[420px] text-sm leading-relaxed text-white/60"
                      >
                        {item.description}
                      </motion.p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <DemoShell>
                <LayoutGroup id="payflow-product-demo">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div key={resolvedStage} layout className="h-full w-full">
                      <ActiveStage />
                    </motion.div>
                  </AnimatePresence>
                </LayoutGroup>
              </DemoShell>
            </div>
          </SectionContainer>
        </div>
      </div>
    </section>
  );
}

function DemoIntro() {
  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-sm font-medium text-primary">See PayFlow in action</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Watch an invoice become a payment
      </h2>
      <p className="mt-4 text-white/65">
        From finished work to a secure payment page, without the manual follow-up.
      </p>
    </div>
  );
}
