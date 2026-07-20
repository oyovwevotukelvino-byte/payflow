// app/(auth)/sign-up/page.tsx
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthFooter } from "@/components/auth/auth-footer";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Create your PayFlow account"
          description="Start sending invoices in minutes."
        />
        <RegisterForm />
      </AuthCard>
      <AuthFooter prompt="Already have an account?" linkText="Sign in" href="/sign-in" />
    </AuthLayout>
  );
}