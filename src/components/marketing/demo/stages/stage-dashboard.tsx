"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";

import { DEMO_INVOICE } from "../demo-data";
import { fadeUp } from "../demo-variants";

export function StageDashboard() {
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUpdated(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-5"
    >
      {/* Dashboard Heading */}

      <div>
        <h3 className="text-lg font-semibold">
          Dashboard
        </h3>

        <p className="text-sm text-muted-foreground">
          Everything updates automatically.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-3">

        {/* Paid Today */}

        <motion.div
          layout
          className="rounded-xl border bg-white p-4"
        >
          <p className="text-xs text-muted-foreground">
            Paid Today
          </p>

          <motion.p
            layout
            className="mt-2 text-xl font-bold"
          >
            {updated ? DEMO_INVOICE.amount : "₦0"}
          </motion.p>
        </motion.div>

        {/* Outstanding */}

        <motion.div
          layout
          className="rounded-xl border bg-white p-4"
        >
          <p className="text-xs text-muted-foreground">
            Outstanding
          </p>

          <motion.p
            layout
            className="mt-2 text-xl font-bold"
          >
            {updated ? "₦0" : DEMO_INVOICE.amount}
          </motion.p>
        </motion.div>

      </div>

      {/* Invoice */}

      <motion.div
        layout
        className="rounded-xl border p-4"
      >
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <FileText
              className="h-5 w-5 text-primary"
            />

            <div>

              <p className="text-sm font-medium">
                Invoice #{DEMO_INVOICE.number}
              </p>

              <p className="text-xs text-muted-foreground">
                {DEMO_INVOICE.customer}
              </p>

            </div>
          </div>

          <motion.div
            layout
            className={
              updated
                ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                : "rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700"
            }
          >
            {updated ? "PAID" : "PENDING"}
          </motion.div>

        </div>
      </motion.div>

      {/* Activity */}

      <motion.div
        layout
        className="rounded-xl border bg-muted/30 p-4"
      >
        <div className="flex items-center gap-3">

          {updated ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <Clock3 className="h-5 w-5 text-yellow-600" />
          )}

          <div>

            <p className="text-sm font-medium">
              {updated
                ? "Payment received"
                : "Awaiting payment"}
            </p>

            <p className="text-xs text-muted-foreground">
              {updated
                ? "Dashboard updated instantly."
                : "Waiting for customer."}
            </p>

          </div>

        </div>
      </motion.div>

      {/* Bottom Success Banner */}

      {updated && (
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-xl bg-green-50 p-4"
        >
          <div className="flex items-center gap-3">

            <Wallet className="h-5 w-5 text-green-600" />

            <div>

              <p className="text-sm font-semibold text-green-700">
                Money received
              </p>

              <p className="text-xs text-green-600">
                No refresh. No checking your bank app.
                PayFlow already knows.
              </p>

            </div>

          </div>
        </motion.div>
      )}
    </motion.div>
  );
}