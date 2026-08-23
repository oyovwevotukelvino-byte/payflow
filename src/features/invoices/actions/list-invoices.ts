// features/invoices/actions/list-invoices.ts
"use server";

import { getSession } from "@/lib/auth/get-session";
import { businessService } from "@/features/business/services/business.service";
import { invoiceService } from "../services/invoice.service";
import type { ActionResult } from "@/lib/types/action-result";
import type { InvoiceSummary } from "../types";

export async function listInvoicesAction(): Promise<ActionResult<InvoiceSummary[]>> {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, error: "You must be signed in to do this." };
  }

  const business = await businessService.getBusinessByUser(session.user.id);

  if (!business) {
    return { success: false, error: "No business found for this account." };
  }

  const invoices = await invoiceService.getInvoices(business.id);
  return { success: true, data: invoices };
}