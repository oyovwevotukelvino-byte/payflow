// app/onboarding/business/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { businessService } from "@/features/business/services/business.service";
import { BusinessForm } from "@/features/business/components/business-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";

export default async function BusinessOnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const hasBusiness = await businessService.existsForUser(session.user.id);
  if (hasBusiness) redirect("/dashboard");

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Let's set up your business"
          description="This only takes about one minute."
        />
        <BusinessForm />
      </AuthCard>
    </AuthLayout>
  );
}