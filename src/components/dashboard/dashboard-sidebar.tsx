// src/components/dashboard/dashboard-sidebar.tsx
import Link from "next/link";
import { DashboardNav } from "./dashboard-nav";

/**
 * Desktop-only fixed sidebar. Hidden below md; DashboardMobileNav
 * (Phase 2) covers that breakpoint via a Sheet instead.
 */
export function DashboardSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          PayFlow
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <DashboardNav />
      </div>
    </aside>
  );
}