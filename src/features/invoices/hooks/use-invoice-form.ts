// features/invoices/hooks/use-invoice-form.ts
"use client";

import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createInvoiceSchema } from "../schemas/invoice-schema";
import { createInvoiceAction } from "../actions/create-invoice";

// Distinct input/output types because dueDate transforms string \u2192 Date
// during validation. Form fields hold the input shape pre-submit; the
// submit handler receives the output shape (dueDate already a real Date).
type InvoiceFormInput = z.input<typeof createInvoiceSchema>;
type InvoiceFormOutput = z.output<typeof createInvoiceSchema>;

const EMPTY_ITEM = { description: "", quantity: 1, unitPrice: "" };

/**
 * Owns all invoice-form state/logic so invoice-form.tsx stays pure
 * markup. RHF + zodResolver gives per-row field errors natively
 * (errors.items?.[index]?.description) via client-side validation.
 *
 * Note: server-side validation failures from createInvoiceAction still
 * only return flat, top-level fieldErrors (Record<string, string[]>),
 * not per-row paths \u2014 so a server rejection of a specific item field
 * currently surfaces as the general form-level error banner, not a
 * highlighted row. Client-side Zod validation (via the resolver below)
 * catches essentially all of that before submission ever happens, so
 * this gap only matters for the rare case a submission passes client
 * validation but still fails server-side for an item-specific reason.
 */
export function useInvoiceForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | undefined>();

  const form = useForm<InvoiceFormInput, unknown, InvoiceFormOutput>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      customerId: "",
      items: [{ ...EMPTY_ITEM }],
      vatEnabled: false,
      notes: "",
      dueDate: "",
    },
  });

  const itemsArray = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setFormError(undefined);
    const result = await createInvoiceAction(data);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof InvoiceFormInput, { message: messages[0] });
        }
      } else {
        setFormError(result.error);
      }
      return;
    }

    router.push(`/invoices/${result.data.id}`);
  });

  return {
    form,
    itemsArray,
    onSubmit,
    formError,
    isSubmitting: form.formState.isSubmitting,
    addItem: () => itemsArray.append({ ...EMPTY_ITEM }),
    removeItem: (index: number) => itemsArray.remove(index),
  };
}