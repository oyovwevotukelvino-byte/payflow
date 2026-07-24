import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { businessService } from "@/features/business/services/business.service";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const business = await businessService.getBusinessByUser(session.user.id);

  if (!business) {
    redirect("/onboarding/business");
  }

  return (
    <DashboardShell
      businessName={business.name}
      userName={session.user.name ?? "there"}
      userEmail={session.user.email ?? ""}
    >
      {children}
    </DashboardShell>
  );
}