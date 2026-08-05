// components/marketing/demo/demo-variants.ts

/**
 * Single source of truth for motion timing/easing across every demo
 * stage — prevents each stage file from inventing its own spring config,
 * which is exactly how "duplicated animations" (flagged as a risk in the
 * brief) happens in practice.
 */
export const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;
export const SOFT_SPRING = { type: "spring", stiffness: 180, damping: 24 } as const;

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};