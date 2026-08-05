// src/components/marketing/footer.tsx
import Link from "next/link";
import { SectionContainer } from "./section-container";

const FOOTER_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "/sign-in", label: "Sign in" },
] as const;

/**
 * No animation, deliberately — a footer's job is wayfinding, not
 * persuasion, so motion here would be decoration without purpose.
 */
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--pf-navy)] py-12">
      <SectionContainer className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-lg font-semibold text-white">PayFlow</p>
          <p className="mt-1 text-sm text-white/50">
            Invoicing and payments for Nigerian businesses.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} PayFlow. Built for Nigerian SMEs.
        </p>
      </SectionContainer>
    </footer>
  );
}