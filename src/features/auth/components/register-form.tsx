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

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, null);

  // Navigation is a client concern per the Step 8 reasoning above — the
  // action returns a typed result rather than redirecting itself, so the
  // component decides what "success" means for navigation.
  useEffect(() => {
    if (state?.success) {
      router.replace("/onboarding/business");
    }
  }, [state, router]);

  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const formLevelError =
    state && !state.success && !fieldErrors ? state.error : undefined;

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" autoComplete="name" required />
        <FormError message={fieldErrors?.name?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FormError message={fieldErrors?.email?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          autoComplete="tel"
          placeholder="08012345678"
          required
        />
        <FormError message={fieldErrors?.phoneNumber?.[0]} />
      </div>

      <PasswordField
        id="password"
        name="password"
        label="Password"
        autoComplete="new-password"
      />
      <FormError message={fieldErrors?.password?.[0]} />

      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
      />
      <FormError message={fieldErrors?.confirmPassword?.[0]} />

      <FormError message={formLevelError} />

      <LoadingButton
        type="submit"
        className="w-full"
        isPending={isPending}
        pendingText="Creating account…"
      >
        Create account
      </LoadingButton>
    </form>
  );
}
