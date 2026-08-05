// components/marketing/demo/use-demo-stage.ts
"use client";

import { useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/**
 * Maps native scroll progress through a tall container to a discrete
 * stage index. This is the ONE place scroll-linking logic lives — every
 * future scroll-driven section (not just this demo) should reuse this
 * hook rather than reimplementing useScroll/useTransform per section.
 */
export function useDemoStage(stageCount: number, vhPerStage = 100) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const stageProgress = useTransform(scrollYProgress, [0, 1], [0, stageCount - 1]);

  useMotionValueEvent(stageProgress, "change", (value) => {
    const index = Math.min(stageCount - 1, Math.max(0, Math.round(value)));
    setStage(index);
  });

  return { containerRef, stage, heightVh: stageCount * vhPerStage };
}