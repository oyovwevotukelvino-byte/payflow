// features/customers/actions/delete-customer.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { businessService } from "@/features/business/services/business.service";
import { customerService, CustomerServiceError } from "../services/customer.service";
import type { ActionResult } from "@/lib/types/action-result";

export async function deleteCustomer(customerId: string): Promise<ActionResult<{ success: true }>> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "You must be signed in to do this." };
  }

  const business = await businessService.getBusinessByUser(session.user.id);

  if (!business) {
    return { success: false, error: "No business found for this account." };
  }

  try {
    await customerService.deleteCustomer(business.id, customerId);
    revalidatePath("/customers");
    return { success: true, data: { success: true } };
  } catch (err) {
    if (err instanceof CustomerServiceError) {
      return { success: false, error: err.message };
    }
    console.error("deleteCustomer: failed", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}