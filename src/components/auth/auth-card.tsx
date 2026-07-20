// components/auth/auth-card.tsx
import type { ReactNode } from "react";

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-surface)] px-6 py-8 sm:px-10 sm:py-10"
      style={{
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 12px 28px -8px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );
}