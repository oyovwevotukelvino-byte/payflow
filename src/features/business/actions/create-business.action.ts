// features/business/actions/create-business.action.ts
"use server";

import { auth } from "@/auth";
import { businessSchema } from "../schemas/business-schema";
import { businessService, BusinessServiceError } from "../services/business.service";
import type { ActionResult } from "@/lib/types/action-result";
import type { Business } from "../services/business.service";

export async function createBusinessAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult<Business>> {
  const session = await auth();

  if (!session?.user) {
    return { success: false, error: "You must be signed in to do this." };
  }

  const parsed = businessSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
    logo: formData.get("logo"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const business = await businessService.createBusiness(session.user.id, parsed.data);
    return { success: true, data: business };
  } catch (err) {
    if (err instanceof BusinessServiceError) {
      return { success: false, error: err.message };
    }
    console.error("createBusinessAction: failed", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}