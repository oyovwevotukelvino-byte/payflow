// src/components/dashboard/dashboard-shell.tsx
import type { ReactNode } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { DashboardContent } from "./dashboard-content";

interface DashboardShellProps {
  children: ReactNode;
  businessName: string;
  userName: string;
  userEmail: string;
}

export function DashboardShell({
  children,
  businessName,
  userName,
  userEmail,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          businessName={businessName}
          userName={userName}
          userEmail={userEmail}
        />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </div>
  );
}