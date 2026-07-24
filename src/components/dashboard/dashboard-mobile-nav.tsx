// src/components/dashboard/dashboard-mobile-nav.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DashboardNav } from "./dashboard-nav";

interface DashboardMobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DashboardMobileNav({ open, onOpenChange }: DashboardMobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle className="text-left text-lg font-semibold tracking-tight">
            PayFlow
          </SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <DashboardNav />
        </div>
      </SheetContent>
    </Sheet>
  );
}