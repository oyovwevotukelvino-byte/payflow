// src/components/marketing/pricing.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "./section-container";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "\u20a60",
    period: "forever",
    description: "For getting started and sending your first invoices.",
    features: ["Up to 10 invoices/month", "WhatsApp delivery", "Payment tracking"],
    cta: "Create free account",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "\u20a65,000",
    period: "/month",
    description: "For businesses sending invoices every week.",
    features: [
      "Unlimited invoices",
      "Automatic payment reminders",
      "Branded invoices",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/sign-up",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Coming soon",
    period: "",
    description: "For businesses managing multiple staff and locations.",
    features: ["Multiple team members", "Role-based permissions", "Dedicated support"],
    cta: "Join the waitlist",
    href: "#",
    highlighted: false,
  },
] as const;

export function Pricing() {
  return (
    <section id="pricing" className="bg-background py-20 sm:py-28">
      <SectionContainer>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Simple pricing, no surprises
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Pay only once PayFlow is already saving you time.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "flex flex-col rounded-2xl border p-7",
                plan.highlighted
                  ? "border-primary bg-primary/[0.03] shadow-[0_16px_40px_rgba(37,99,235,0.12)]"
                  : "border-border bg-white"
              )}
            >
              <p className="text-sm font-semibold text-foreground">{plan.name}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={cn(
                  "mt-7 w-full",
                  plan.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-transparent text-foreground border border-border hover:bg-muted"
                )}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}