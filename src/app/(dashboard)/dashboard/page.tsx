import { FileText, CheckCircle2, Clock, Wallet } from "lucide-react";
import { auth } from "@/auth";

import { StatCard } from "@/components/dashboard/cards/stat-card";
import { QuickActionsCard } from "@/components/dashboard/cards/quick-actions-card";
import { ActivityCard } from "@/components/dashboard/cards/activity-card";

const PLACEHOLDER_STATS = [
  { label: "Invoices", value: "0", icon: FileText },
  { label: "Paid", value: "0", icon: CheckCircle2 },
  { label: "Outstanding", value: "0", icon: Clock },
  { label: "Revenue", value: "₦0", icon: Wallet },
] as const;

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {firstName}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLACEHOLDER_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <QuickActionsCard />

      <ActivityCard />
    </div>
  );
}