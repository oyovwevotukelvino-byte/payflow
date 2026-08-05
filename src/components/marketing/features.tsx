// src/components/marketing/features.tsx
"use client";

import { motion } from "framer-motion";
import { FileText, MessageCircle, Wallet } from "lucide-react";
import { SectionContainer } from "./section-container";

const FEATURES = [
  {
    icon: FileText,
    title: "Look professional from the first message",
    description:
      "A branded invoice beats a screenshot of your account number. Send one in under 30 seconds — no design skills needed.",
  },
  {
    icon: MessageCircle,
    title: "PayFlow reminds them, so you don't have to",
    description:
      "No more \u2018please remember to pay\u2019 texts. If a customer forgets, a reminder goes out automatically — never from you.",
  },
  {
    icon: Wallet,
    title: "Know exactly who's paid — and who hasn't Real-time payment tracking",
    description:
      "The moment a payment lands, Your dashboard updates  No more checking transfers one by one to be sure.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="bg-background py-20 sm:py-28">
      <SectionContainer>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What used to keep you up at night 
          </h2>
          <p className="mt-4 text-muted-foreground">
             Three quiet problems, solved before they happen. chasing payments, checking transfers, sending reminders — is now handled automatically.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-2xl border border-border bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}