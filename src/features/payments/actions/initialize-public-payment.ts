// src/features/payments/actions/initialize-public-payment.ts

"use server";

import { initializePublicPaymentSchema } from "../schemas/public-payment-schema";
import {
  paymentOrchestratorService,
  PaymentOrchestrationError,
} from "../services/payment-orchestrator.service";
import type { ActionResult } from "@/lib/types/action-result";

export async function initializePublicPaymentAction(
  input: unknown
): Promise<ActionResult<{ authorizationUrl: string }>> {
  const parsed = initializePublicPaymentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid payment link.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result =
      await paymentOrchestratorService.initializePublicPayment(
        parsed.data
      );

    return {
      success: true,
      data: {
        authorizationUrl: result.authorizationUrl,
      },
    };
  } catch (err) {
    if (err instanceof PaymentOrchestrationError) {
      return {
        success: false,
        error: err.message,
      };
    }

    console.error(
      "initializePublicPaymentAction: failed",
      err
    );

    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}