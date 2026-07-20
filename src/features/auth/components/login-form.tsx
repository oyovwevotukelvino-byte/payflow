// features/auth/components/login-form.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions/login.action";
import { PasswordField } from "./password-field";
import { LoadingButton } from "@/components/shared/forms/loading-button";
import { FormError } from "@/components/shared/forms/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const inputClass =
  "h-11 rounded-lg border-[var(--pf-border)] px-3.5 text-[15px] focus-visible:ring-2 focus-visible:ring-[var(--pf-brand)]/40 focus-visible:ring-offset-0 focus-visible:border-[var(--pf-brand)]";
const labelClass = "text-sm font-medium text-[var(--pf-ink)]";

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) router.push("/dashboard");
  }, [state, router]);

  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const formLevelError =
    state && !state.success && !fieldErrors ? state.error : undefined;

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email" className={labelClass}>Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
        <FormError message={fieldErrors?.email?.[0]} />
      </div>

      <div className="space-y-1.5">
        <PasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
        />
        <FormError message={fieldErrors?.password?.[0]} />
      </div>

      <FormError message={formLevelError} />

      <LoadingButton isPending={isPending} pendingText="Signing in…">
        Sign in
      </LoadingButton>
    </form>
  );
}