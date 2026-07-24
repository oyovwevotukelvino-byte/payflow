// src/components/dashboard/dashboard-header.tsx
"use client";

import { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessSwitcher } from "./business-switcher";
import { UserMenu } from "./user-menu";
import { DashboardMobileNav } from "./dashboard-mobile-nav";

interface DashboardHeaderProps {
  businessName: string;
  userName: string;
  userEmail: string;
}

export function DashboardHeader({
  businessName,
  userName,
  userEmail,
}: DashboardHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <BusinessSwitcher businessName={businessName} />
        </div>

        <Button variant="ghost" size="icon" aria-label="Search" disabled>
          <Search className="h-[18px] w-[18px]" />
        </Button>

        <Button variant="ghost" size="icon" aria-label="Notifications" disabled>
          <Bell className="h-[18px] w-[18px]" />
        </Button>

        <UserMenu name={userName} email={userEmail} />
      </header>

      <DashboardMobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
    </>
  );
}