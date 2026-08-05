// features/customers/actions/create-customer.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { businessService } from "@/features/business/services/business.service";
import { customerSchema } from "../schemas/customer-schema";
import { customerService, CustomerServiceError } from "../services/customer.service";
import type { ActionResult } from "@/lib/types/action-result";
import type { CustomerSummary } from "../types";

export async function createCustomer(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult<CustomerSummary>> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "You must be signed in to do this." };
  }

  const business = await businessService.getBusinessByUser(session.user.id);

  if (!business) {
    return { success: false, error: "No business found for this account." };
  }

  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const customer = await customerService.createCustomer(business.id, parsed.data);
    revalidatePath("/customers");
    return { success: true, data: customer };
  } catch (err) {
    if (err instanceof CustomerServiceError) {
      return { success: false, error: err.message };
    }
    console.error("createCustomer: failed", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}