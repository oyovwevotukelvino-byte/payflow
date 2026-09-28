"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth/get-session";
import { businessService } from "@/features/business/services/business.service";
import type { ActionResult } from "@/lib/types/action-result";

import {
  invoiceService,
  InvoiceServiceError,
  type InvoiceSummary,
} from "../services/invoice.service";

export async function markInvoiceAsSentAction(
  invoiceId: string
): Promise<ActionResult<InvoiceSummary>> {
  if (!invoiceId?.trim()) {
    return {
      success: false,
      error: "Invoice ID is required.",
    };
  }

  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      error: "You must be signed in to perform this action.",
    };
  }

  try {
    const business = await businessService.getBusinessByUser(session.user.id);

    if (!business) {
      return {
        success: false,
        error: "Business profile not found.",
      };
    }

    const invoice = await invoiceService.markInvoiceAsSent(
      business.id,
      invoiceId
    );

    revalidatePath("/invoices");
    revalidatePath(`/invoices/${invoiceId}`);

    return {
      success: true,
      data: invoice,
    };
  } catch (error) {
    if (error instanceof InvoiceServiceError) {
      return {
        success: false,
        error: error.message,
      };
    }

    console.error("markInvoiceAsSentAction: failed", error);

    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
