// src/components/dashboard/dashboard-content.tsx
import type { ReactNode } from "react";

/**
 * Consistent content wrapper every dashboard page renders inside.
 * Centralizes padding/max-width so no page repeats these classes.
 */
export function DashboardContent({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">{children}</div>
    </main>
  );
}