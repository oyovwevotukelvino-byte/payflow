// features/auth/components/register-form.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "../actions/register.action";
import { PasswordField } from "./password-field";
import { LoadingButton } from "@/components/shared/forms/loading-button";
import { FormError } from "@/components/shared/forms/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const inputClass =
  "h-11 rounded-lg border-[var(--pf-border)] px-3.5 text-[15px] focus-visible:ring-2 focus-visible:ring-[var(--pf-brand)]/40 focus-visible:ring-offset-0 focus-visible:border-[var(--pf-brand)]";
const labelClass = "text-sm font-medium text-[var(--pf-ink)]";

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.success) router.push("/onboarding/business");
  }, [state, router]);

  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const formLevelError =
    state && !state.success && !fieldErrors ? state.error : undefined;

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name" className={labelClass}>Full name</Label>
        <Input id="name" name="name" autoComplete="name" required className={inputClass} />
        <FormError message={fieldErrors?.name?.[0]} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className={labelClass}>Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required className={inputClass} />
        <FormError message={fieldErrors?.email?.[0]} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phoneNumber" className={labelClass}>Phone number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          autoComplete="tel"
          placeholder="08012345678"
          required
          className={inputClass}
        />
        <FormError message={fieldErrors?.phoneNumber?.[0]} />
      </div>

      <div className="space-y-1.5">
        <PasswordField id="password" name="password" label="Password" autoComplete="new-password" />
        <FormError message={fieldErrors?.password?.[0]} />
      </div>

      <div className="space-y-1.5">
        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
        />
        <FormError message={fieldErrors?.confirmPassword?.[0]} />
      </div>

      <FormError message={formLevelError} />

      <LoadingButton isPending={isPending} pendingText="Creating account…">
        Create account
      </LoadingButton>
    </form>
  );
}