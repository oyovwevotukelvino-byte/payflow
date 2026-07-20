// features/business/components/business-form.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBusinessAction } from "../actions/create-business.action";
import { LoadingButton } from "@/components/shared/forms/loading-button";
import { FormError } from "@/components/shared/forms/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BusinessForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createBusinessAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const formLevelError =
    state && !state.success && !fieldErrors ? state.error : undefined;

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Business name</Label>
        <Input id="name" name="name" required />
        <FormError message={fieldErrors?.name?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number (optional)</Label>
        <Input id="phone" name="phone" type="tel" placeholder="08012345678" />
        <FormError message={fieldErrors?.phone?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Business email (optional)</Label>
        <Input id="email" name="email" type="email" />
        <FormError message={fieldErrors?.email?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address (optional)</Label>
        <Input id="address" name="address" />
        <FormError message={fieldErrors?.address?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo URL (optional)</Label>
        <Input id="logo" name="logo" placeholder="https://…" />
        <FormError message={fieldErrors?.logo?.[0]} />
      </div>

      <FormError message={formLevelError} />

      <LoadingButton
        type="submit"
        className="w-full"
        isPending={isPending}
        pendingText="Creating business…"
      >
        Continue to dashboard
      </LoadingButton>
    </form>
  );
}