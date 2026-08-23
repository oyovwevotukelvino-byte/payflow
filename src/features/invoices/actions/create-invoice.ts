// features/invoices/actions/create-invoice.ts
"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/get-session";
import { businessService } from "@/features/business/services/business.service";
import { createInvoiceSchema, type CreateInvoiceInput } from "../schemas/invoice-schema";
import { invoiceService, InvoiceServiceError } from "../services/invoice.service";
import type { ActionResult } from "@/lib/types/action-result";
import type { InvoiceSummary } from "../types";

export async function createInvoiceAction(
  input: CreateInvoiceInput
): Promise<ActionResult<InvoiceSummary>> {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, error: "You must be signed in to do this." };
  }

  const business = await businessService.getBusinessByUser(session.user.id);

  if (!business) {
    return { success: false, error: "No business found for this account." };
  }

  const parsed = createInvoiceSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const invoice = await invoiceService.createInvoice(business.id, parsed.data);
    revalidatePath("/invoices");
    return { success: true, data: invoice };
  } catch (err) {
    if (err instanceof InvoiceServiceError) {
      return { success: false, error: err.message };
    }
    console.error("createInvoiceAction: failed", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}