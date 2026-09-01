"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  TrendingUp,
  Wallet,
  Bell,
} from "lucide-react";

import { fadeUp } from "../demo-variants";
import { DEMO_INVOICE } from "../demo-data";

export function StageComplete() {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full flex-col"
    >
      {/* Success Banner */}

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>

          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Invoice Paid
            </p>

            <p className="text-xs text-emerald-600">
              {DEMO_INVOICE.customer} paid {DEMO_INVOICE.amount}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Cards */}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard
          icon={Wallet}
          label="Revenue"
          value="₦245,000"
          delay={0.15}
        />

        <StatCard
          icon={TrendingUp}
          label="Paid Invoices"
          value="18"
          delay={0.25}
        />
      </div>

      {/* Notification */}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 rounded-xl border border-border bg-muted/30 p-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-sm font-medium">
              WhatsApp Notification Sent
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Your customer has received a payment confirmation.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Closing Message */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-auto pt-8 text-center"
      >
        <p className="text-base font-semibold">
          That&apos;s it.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          One invoice. One WhatsApp message.
          One payment.
          No chasing customers.
        </p>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay,
      }}
      className="rounded-xl border border-border bg-background p-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            {label}
          </p>

          <p className="text-lg font-semibold">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}