// src/components/marketing/testimonials.tsx
"use client";

import { motion } from "framer-motion";
import { SectionContainer } from "./section-container";

const TESTIMONIALS = [
  {
    initials: "AO",
    name: "Amara Okafor",
    business: "Amara's Boutique",
    quote:
      "I used to screenshot my account number for every single customer. Now I just send a link and I know the second they've paid. No more \u2018please confirm you've sent it\u2019 messages.",
  },
  {
    initials: "TA",
    name: "Tunde Adeyemi",
    business: "Tunde Furniture",
    quote:
      "My orders are big \u2014 sometimes hundreds of thousands of naira. I needed something that looked serious. PayFlow invoices make a customer trust the payment link is really from me.",
  },
  {
    initials: "BE",
    name: "Blessing Eze",
    business: "Blessing Events",
    quote:
      "Event clients pay in bits and pieces. I was losing track of who owed what. Now PayFlow tells me exactly who's outstanding before I even open my laptop.",
  },
] as const;

export function Testimonials() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <SectionContainer>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Business owners, not case studies
          </h2>
          <p className="mt-4 text-muted-foreground">
            The same three problems, solved differently for three different businesses.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col rounded-2xl border border-border bg-white p-7"
            >
              <p className="flex-1 text-sm leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.business}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}