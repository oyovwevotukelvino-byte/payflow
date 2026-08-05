// components/marketing/demo/demo-shell.tsx
"use client";

import type { ReactNode } from "react";
import { LayoutDashboard, FileText, Users, CreditCard } from "lucide-react";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileText, label: "Invoices", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: CreditCard, label: "Payments", active: false },
] as const;

/**
 * The persistent "browser window" frame. This NEVER unmounts across
 * stages — only its children slot changes. This is what makes the
 * dashboard feel like one continuous product rather than eight
 * disconnected screenshots swapped in and out.
 */
export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:max-w-[380px] lg:max-w-[540px]">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/30 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        <span className="ml-3 text-xs text-muted-foreground">payflow.ng</span>
      </div>

      <div className="flex">
        <div className="hidden w-28 shrink-0 border-r border-border bg-muted/20 p-3 sm:block">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <div  
                key={item.label}
                className={
                  item.active
                    ? "flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1.5 text-[11px] font-medium text-primary"
                    : "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-muted-foreground"
                }
              >
                <item.icon className="h-3 w-3" aria-hidden="true" />
                {item.label}
              </div>
            ))}
          </nav>
        </div>

        <div className="relative flex min-h-[260px] flex-1 items-center justify-center p-4 sm:min-h-[340px]">
          {children}
        </div>
      </div>
    </div>
  );
}
