// components/auth/auth-layout.tsx
import type { ReactNode } from "react";
import { BrandMark } from "./brand-mark";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--pf-canvas)] px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center gap-2">
        <BrandMark />
        <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--pf-ink)]">
          PayFlow
        </span>
      </div>
      <div className="w-full max-w-[440px]">{children}</div>
    </div>
  );
}