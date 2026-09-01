// features/payments/actions/initialize-payment.ts
"use server";

import { getSession } from "@/lib/auth/get-session";
import { businessService } from "@/features/business/services/business.service";
import { initializePaymentSchema } from "../schemas/payment-schema";
import {
  paymentOrchestratorService,
  PaymentOrchestrationError,
} from "../services/payment-orchestrator.service";
import type { ActionResult } from "@/lib/types/action-result";
import type { PaymentInitializationInput } from "../types";

export async function initializePaymentAction(
  input: PaymentInitializationInput
): Promise<ActionResult<{ authorizationUrl: string }>> {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, error: "You must be signed in to do this." };
  }

  const business = await businessService.getBusinessByUser(session.user.id);

  if (!business) {
    return { success: false, error: "No business found for this account." };
  }

  const parsed = initializePaymentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the request and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await paymentOrchestratorService.initializePayment(
      business.id,
      parsed.data
    );
    return { success: true, data: { authorizationUrl: result.authorizationUrl } };
  } catch (err) {
    if (err instanceof PaymentOrchestrationError) {
      return { success: false, error: err.message };
    }
    console.error("initializePaymentAction: failed", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}