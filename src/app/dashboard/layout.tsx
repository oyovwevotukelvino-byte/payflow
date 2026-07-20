import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { businessService } from "@/features/business/services/business.service";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const hasBusiness = await businessService.existsForUser(session.user.id);

  if (!hasBusiness) {
    redirect("/onboarding/business");
  }

  return <>{children}</>;
}