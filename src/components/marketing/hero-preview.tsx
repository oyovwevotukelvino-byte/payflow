// src/components/marketing/hero-preview.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FileText, MessageCircle, Wallet, CheckCircle2, TrendingUp } from "lucide-react";

const STEP_DURATION_MS = 1800;
const HOLD_DURATION_MS = 2600;
const TOTAL_STEPS = 3; // 0: sent, 1: whatsapp, 2: payment received, 3: paid + analytics

const EASE = [0.16, 1, 0.3, 1] as const; // deliberate ease-out, no spring/bounce

/**
 * The hero's signature element: a small, self-contained narrative —
 * invoice sent → delivered via WhatsApp → payment received → paid —
 * told through real product surfaces (an invoice card, a chat bubble, a
 * payment toast) rather than abstract decorative shapes.
 */
export function HeroPreview() {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState(prefersReducedMotion ? 3 : 0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let timeout: ReturnType<typeof setTimeout>;

    const advance = (current: number) => {
      const isFinal = current >= TOTAL_STEPS;
      const delay = isFinal ? HOLD_DURATION_MS : STEP_DURATION_MS;

      timeout = setTimeout(() => {
        setStep(isFinal ? 0 : current + 1);
      }, delay);
    };

    advance(step);
    return () => clearTimeout(timeout);
  }, [step, prefersReducedMotion]);

  const showWhatsApp = step >= 1;
  const showPaymentToast = step >= 2;
  const isPaid = step >= 3;

  return (
    <div className="relative mx-auto h-[420px] w-full max-w-md sm:h-[460px]">
      {/* Invoice card — always present, the anchor element */}
      <motion.div
        layout
        transition={{ duration: 0.5, ease: EASE }}
        className="absolute left-1/2 top-8 w-72 -translate-x-1/2 rounded-2xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">
              INV-0231
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={isPaid ? "paid" : "pending"}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3 }}
              className={
                isPaid
                  ? "flex items-center gap-1 rounded-full bg-[var(--success)]/10 px-2.5 py-1 text-xs font-medium text-[var(--success)]"
                  : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              }
            >
              {isPaid && <CheckCircle2 className="h-3 w-3" aria-hidden="true" />}
              {isPaid ? "Paid" : "Sent"}
            </motion.span>
          </AnimatePresence>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">Amara&apos;s Boutique</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          ₦45,000
        </p>
      </motion.div>

      {/* WhatsApp delivery bubble — stylized, not a literal recreation of
          WhatsApp's UI; a chat-bubble shape with a message icon is enough
          to communicate the channel without reproducing another
          product's exact interface. */}
      <AnimatePresence>
        {showWhatsApp && (
          <motion.div
            initial={{ opacity: 0, x: -16, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute left-2 top-[190px] flex items-center gap-2 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.10)] sm:left-0"
          >
            <MessageCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-xs font-medium text-foreground">
              Sent via WhatsApp — ₦45,000
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment notification toast */}
      <AnimatePresence>
        {showPaymentToast && (
          <motion.div
            initial={{ opacity: 0, x: 16, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute right-2 top-[250px] flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.10)] sm:right-0"
          >
            <Wallet className="h-4 w-4 shrink-0 text-[var(--success)]" aria-hidden="true" />
            <span className="text-xs font-medium text-foreground">
             Payment received — ₦45,000
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating analytics card */}
      <AnimatePresence>
        {isPaid && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
          >
            <TrendingUp className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">
              Revenue up
            </span>
            <span className="text-xs font-semibold text-foreground">₦128,400</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}