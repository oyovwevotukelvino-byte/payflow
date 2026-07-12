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

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) {
      router.replace("/dashboard");
    }
  }, [state, router]);

    const fieldErrors =
  state && !state.success
    ? state.fieldErrors
    : undefined;

  const hasFieldErrors =
  !!fieldErrors &&
  Object.keys(fieldErrors).length > 0;

  const formLevelError =
  state &&
  !state.success &&
  !hasFieldErrors
    ? state.error
    : undefined;

 
  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FormError message={fieldErrors?.email?.[0]} />
      </div>

      <PasswordField
        id="password"
        name="password"
        label="Password"
        autoComplete="current-password"
      />
      <FormError message={fieldErrors?.password?.[0]} />

      <FormError message={formLevelError} />

      <LoadingButton
        type="submit"
        className="w-full"
        isPending={isPending}
        pendingText="Signing in…"
      >
        Sign in
      </LoadingButton>
    </form>
  );
}