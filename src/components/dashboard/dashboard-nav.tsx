// src/components/dashboard/dashboard-nav.tsx
"use client";

import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Settings,
} from "lucide-react";
import { NavItem } from "./nav-item";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardNav() {
  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </nav>
  );
}