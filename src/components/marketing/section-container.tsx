// src/components/marketing/section-container.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Consistent max-width/padding wrapper for every marketing section —
 * the marketing-site equivalent of DashboardContent. One place to adjust
 * the page's horizontal rhythm.
 */
export function SectionContainer({ children, className }: SectionContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}