// src/app/page.tsx — REPLACES the Sprint 1 version
import { redirect } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { auth } from "@/auth";
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { TrustSection } from "@/components/marketing/trust-section";
import { Features } from "@/components/marketing/features";
import { Walkthrough } from "@/components/marketing/walkthrough";
import { PaymentTracking } from "@/components/marketing/payment-tracking";
import { Comparison } from "@/components/marketing/comparison";
import { Testimonials } from "@/components/marketing/testimonials";
import { Pricing } from "@/components/marketing/pricing";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import { CapabilityStrip } from "@/components/marketing/capability-strip";
import { InteractiveDemo } from "@/components/marketing/interactive-demo";
import { Footer } from "@/components/marketing/footer";

export const metadata = {
  title: "PayFlow \u2014 Invoice. Send on WhatsApp. Get paid faster.",
  description:
    "Create professional invoices, send them on WhatsApp, and know the moment you're paid. Built for Nigerian businesses.",
};

export default async function HomePage() {
//   const session = await auth();

//   if (session?.user) {
//     redirect("/dashboard");
// }
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <InteractiveDemo />
        <TrustSection />
        <Features />
        <CapabilityStrip />
        <Walkthrough />
        <PaymentTracking />
        <Comparison />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
        
      </main>

      <Footer />
    </MotionConfig>
  );
}