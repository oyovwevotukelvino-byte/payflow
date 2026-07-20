// features/business/components/business-form.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBusinessAction } from "../actions/create-business.action";
import { LoadingButton } from "@/components/shared/forms/loading-button";
import { FormError } from "@/components/shared/forms/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const inputClass =
  "h-11 rounded-lg border-[var(--pf-border)] px-3.5 text-[15px] focus-visible:ring-2 focus-visible:ring-[var(--pf-brand)]/40 focus-visible:ring-offset-0 focus-visible:border-[var(--pf-brand)]";
const labelClass = "text-sm font-medium text-[var(--pf-ink)]";

export function BusinessForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createBusinessAction, null);

  useEffect(() => {
    if (state?.success) router.push("/dashboard");
  }, [state, router]);

  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const formLevelError =
    state && !state.success && !fieldErrors ? state.error : undefined;

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name" className={labelClass}>Business name</Label>
        <Input id="name" name="name" required className={inputClass} />
        <FormError message={fieldErrors?.name?.[0]} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className={labelClass}>Phone number <span className="font-normal text-[var(--pf-ink-muted)]">(optional)</span></Label>
        <Input id="phone" name="phone" type="tel" placeholder="08012345678" className={inputClass} />
        <FormError message={fieldErrors?.phone?.[0]} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className={labelClass}>Business email <span className="font-normal text-[var(--pf-ink-muted)]">(optional)</span></Label>
        <Input id="email" name="email" type="email" className={inputClass} />
        <FormError message={fieldErrors?.email?.[0]} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address" className={labelClass}>Address <span className="font-normal text-[var(--pf-ink-muted)]">(optional)</span></Label>
        <Input id="address" name="address" className={inputClass} />
        <FormError message={fieldErrors?.address?.[0]} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="logo" className={labelClass}>Logo URL <span className="font-normal text-[var(--pf-ink-muted)]">(optional)</span></Label>
        <Input id="logo" name="logo" placeholder="https://…" className={inputClass} />
        <FormError message={fieldErrors?.logo?.[0]} />
      </div>

      <FormError message={formLevelError} />

      <LoadingButton isPending={isPending} pendingText="Creating business…">
        Continue to dashboard
      </LoadingButton>
    </form>
  );
}