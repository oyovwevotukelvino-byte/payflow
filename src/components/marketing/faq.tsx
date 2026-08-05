// src/components/marketing/faq.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionContainer } from "./section-container";

const FAQS = [
  {
    question: "Do my customers need WhatsApp Business, or just regular WhatsApp?",
    answer:
      "Just regular WhatsApp. Your customer taps the link like any other message \u2014 no app to download, no account to create.",
  },
  {
    question: "I'm not very technical. Is this hard to set up?",
    answer:
      "If you can send a WhatsApp message, you can use PayFlow. Creating your first invoice takes under a minute.",
  },
  {
    question: "How does the money actually reach me?",
    answer:
      "Payments go through Paystack directly to your account. PayFlow never holds your money.",
  },
  {
    question: "What if a customer says they've paid but I don't see it?",
    answer:
      "Your dashboard only shows a payment as \u2018Paid\u2019 once it's actually confirmed \u2014 so you never have to just take someone's word for it.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No contract, no lock-in. Start on the free plan and upgrade only when you need to.",
  },
] as const;

export function FAQ() {
  return (
    <section id="faq" className="bg-background py-20 sm:py-28">
      <SectionContainer className="mx-auto max-w-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Questions business owners actually ask
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-10">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left text-sm font-medium text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SectionContainer>
    </section>
  );
}