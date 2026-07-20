// app/(auth)/sign-in/page.tsx
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthFooter } from "@/components/auth/auth-footer";
import { LoginForm } from "@/features/auth/components/login-form";

export default function SignInPage() {
  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Welcome back"
          description="Sign in to continue managing your business."
        />
        <LoginForm />
      </AuthCard>
      <AuthFooter prompt="Don't have an account?" linkText="Create one" href="/sign-up" />
    </AuthLayout>
  );
}