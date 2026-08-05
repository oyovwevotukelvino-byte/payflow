// src/components/marketing/hero.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "./section-container";
import { HeroPreview } from "./hero-preview";

/**
 * Navy is a supporting canvas here, not the source of impact — headline
 * is deliberately restrained (no oversized display treatment competing
 * with HeroPreview) so the animated invoice→WhatsApp→paid sequence reads
 * as the section's actual subject.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--pf-navy)] pb-20 pt-32 sm:pb-28 sm:pt-40">
      <SectionContainer className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Stop chasing customers
            <br />
           for payment.
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/70 lg:mx-0">
            Send a professional invoice on WhatsApp, and know the moment it&apos;s
            paid — no bank alerts to check, no awkward follow-up messages to send. built for Nigerian
            businesses that run on WhatsApp.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              asChild
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              <Link href="/sign-up">
                Create free account
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <a href="#how-it-works">Watch demo</a>
            </Button>
          </div>
        </div>

        <div>
          <HeroPreview />
        </div>
      </SectionContainer>
    </section>
  );
}