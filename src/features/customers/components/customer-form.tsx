// features/customers/components/customer-form.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createCustomer } from "../actions/create-customer";
import { updateCustomer } from "../actions/update-customer";
import { LoadingButton } from "@/components/shared/forms/loading-button";
import { FormError } from "@/components/shared/forms/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CustomerSummary } from "../types";

interface CustomerFormProps {
  customer?: CustomerSummary;
  onSuccess?: () => void;
}

const inputClass =
  "h-11 rounded-lg border-border px-3.5 text-[15px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0";
const labelClass = "text-sm font-medium text-foreground";

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const router = useRouter();
  const isEditing = Boolean(customer);

  const action = isEditing ? updateCustomer.bind(null, customer!.id) : createCustomer;
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
      onSuccess?.();
    }
  }, [state, router, onSuccess]);

  const fieldErrors = state && !state.success ? state.fieldErrors : undefined;
  const formLevelError = state && !state.success && !fieldErrors ? state.error : undefined;

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name" className={labelClass}>Customer Name</Label>
        <Input id="name" name="name" defaultValue={customer?.name} required className={inputClass} />
        <FormError message={fieldErrors?.name?.[0]} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className={labelClass}>Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="08012345678"
          defaultValue={customer?.phone}
          required
          className={inputClass}
        />
        <FormError message={fieldErrors?.phone?.[0]} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className={labelClass}>
          Email <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input id="email" name="email" type="email" defaultValue={customer?.email ?? ""} className={inputClass} />
        <FormError message={fieldErrors?.email?.[0]} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address" className={labelClass}>
          Address <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input id="address" name="address" defaultValue={customer?.address ?? ""} className={inputClass} />
        <FormError message={fieldErrors?.address?.[0]} />
      </div>

      <FormError message={formLevelError} />

      <LoadingButton
        type="submit"
        className="w-full"
        isPending={isPending}
        pendingText={isEditing ? "Saving\u2026" : "Adding customer\u2026"}
      >
        {isEditing ? "Update customer" : "Save customer"}
      </LoadingButton>
    </form>
  );
}