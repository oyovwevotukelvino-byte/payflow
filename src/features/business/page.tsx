// app/onboarding/business/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { businessService } from "@/features/business/services/business.service";
import { BusinessForm } from "@/features/business/components/business-form";

export default async function BusinessOnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const hasBusiness = await businessService.existsForUser(session.user.id);
  if (hasBusiness) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-lg py-12">
      <h1 className="mb-2 text-2xl font-semibold">Set up your business</h1>
      <p className="mb-8 text-muted-foreground">
        This takes about a minute. You can update these details later.
      </p>
      <BusinessForm />
    </div>
  );
}