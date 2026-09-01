// src/components/marketing/payment-tracking.tsx
"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { SectionContainer } from "./section-container";

const NAV_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    active: true,
  },
  {
    icon: FileText,
    label: "Invoices",
    active: false,
  },
  {
    icon: Users,
    label: "Customers",
    active: false,
  },
  {
    icon: CreditCard,
    label: "Payments",
    active: false,
  },
  {
    icon: Settings,
    label: "Settings",
    active: false,
  },
] as const;

const STATS = [
  { label: "Invoices", value: "18" },
  { label: "Paid", value: "14" },
  { label: "Outstanding", value: "4" },
  { label: "Revenue", value: "\u20a6612,000" },
] as const;

const RECENT_INVOICES = [
  { customer: "Amara's Boutique", amount: "\u20a645,000", status: "Paid" },
  { customer: "Tunde Furniture", amount: "\u20a6180,000", status: "Outstanding" },
  { customer: "Blessing Events", amount: "\u20a675,000", status: "Paid" },
] as const;

/**
 * A local, illustrative recreation of the dashboard — not the real
 * DashboardShell/StatCard components. Deliberately decoupled so a future
 * app redesign doesn't silently change the marketing page, and vice versa.
 */
export function PaymentTracking() {
  return (
    <section id="payment-tracking" className="bg-(--pf-navy) py-20 sm:py-28">
      <SectionContainer>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Know who&apos;s paid, at a glance
          </h2>
          <p className="mt-4 text-white/70">
            No more scrolling through bank alerts trying to match a transfer to an invoice.
          </p>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
          >
            <div className="flex">
              <div className="hidden w-40 shrink-0 border-r border-border bg-muted/40 p-4 sm:block">
                <div className="mb-6 text-sm font-semibold text-foreground">PayFlow</div>
                <nav className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <div
                      key={item.label}
                      className={
                        item.active
                          ? "flex items-center gap-2 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary"
                          : "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground"
                      }
                    >
                      <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>

              <div className="flex-1 p-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-border p-3">
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  {RECENT_INVOICES.map((invoice) => (
                    <div
                      key={invoice.customer}
                      className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                    >
                      <span className="text-xs font-medium text-foreground">
                        {invoice.customer}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{invoice.amount}</span>
                        <span
                          className={
                            invoice.status === "Paid"
                              ? "rounded-full bg-(--success)/10 px-2 py-0.5 text-[10px] font-medium text-(--success)"
                              : "rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                          }
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* The Nigerian moment — a real confirmation, not a stock chat screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-white/10 bg-white/4 p-6"
          >
            <p className="text-sm font-medium text-white/50">Amara&apos;s Boutique &middot; WhatsApp</p>
            <div className="mt-4 space-y-2">
              <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-white">
                 Good afternoon! Your invoice is ready — ₦45,000. Pay securely here: payflow.app/i/23k91
              </div>
              <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-sm text-white">
                Payment sent ✅
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-(--success)/10 px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-(--success)" aria-hidden="true" />
              <span className="text-xs font-medium text-(--success)">
                Payment received — ₦45,000. Invoice marked as Paid.
              </span>
            </div>
          </motion.div>
        </div>
      </SectionContainer>
    </section>
  );
}