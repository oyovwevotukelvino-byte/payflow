"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, CircleDashed, Wallet } from "lucide-react";

import { DEMO_INVOICE } from "../demo-data";
import { SuccessCheck } from "../components/success-check";
import { fadeUp } from "../demo-variants";

type PaymentStatus =
  | "processing"
  | "confirming"
  | "success";
const PROCESSING_DURATION = 500;
const CONFIRMING_DURATION = 700;

export function StageSuccess() {
  const [status, setStatus] =
    useState<PaymentStatus>("processing");

  useEffect(() => {
   setTimeout(() => {
  setStatus("confirming");
}, PROCESSING_DURATION);

setTimeout(() => {
  setStatus("success");
}, PROCESSING_DURATION + CONFIRMING_DURATION);

    return () => {
      const PROCESSING_DURATION = 500;
const CONFIRMING_DURATION = 700;
    };
  }, []);

  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full flex-col items-center justify-center"
    >
      {/* -------------------------------- */}
      {/* Icon */}
      {/* -------------------------------- */}

      <AnimatePresence mode="wait">
        {status === "processing" && (
          <motion.div
            key="processing-icon"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
          >
            <Loader2 className="h-9 w-9 animate-spin text-primary" />
          </motion.div>
        )}

        {status === "confirming" && (
          <motion.div
            key="confirming-icon"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/5"
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                ease: "linear",
              }}
            >
              <CircleDashed className="h-10 w-10 text-primary" />
            </motion.div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success-icon"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <SuccessCheck />
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------- */}
      {/* Status Text */}
      {/* -------------------------------- */}

      <AnimatePresence mode="wait">
        <motion.h3
          key={status}
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -8,
          }}
          transition={{
            duration: 0.25,
          }}
          className="mt-8 text-xl font-semibold text-foreground"
        >
          {status === "processing" &&
            "Processing payment..."}

          {status === "confirming" &&
            "Confirming payment..."}

          {status === "success" &&
            "Payment Successful"}
        </motion.h3>
      </AnimatePresence>

      {/* -------------------------------- */}
      {/* Subtitle */}
      {/* -------------------------------- */}

      <AnimatePresence>
        {status === "success" && (
          <motion.p
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="mt-2 text-center text-sm text-muted-foreground"
          >
            {DEMO_INVOICE.customer} has paid
          </motion.p>
        )}
      </AnimatePresence>

      {/* -------------------------------- */}
      {/* Amount Card */}
      {/* -------------------------------- */}

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              delay: 0.2,
            }}
            className="mt-6 rounded-2xl border border-border bg-muted/40 px-8 py-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Wallet
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Amount received
                </p>

                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {DEMO_INVOICE.amount}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------------------------------- */}
      {/* Updating Dashboard */}
      {/* -------------------------------- */}

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.45,
            }}
            className="mt-8 rounded-full bg-primary/10 px-4 py-2"
          >
            <span className="text-xs font-medium text-primary">
              Updating dashboard...
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}