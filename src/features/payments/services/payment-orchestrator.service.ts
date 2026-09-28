// features/payments/services/payment-orchestrator.service.ts
import { env } from "@/lib/env";
import { paymentService, PaymentServiceError } from "./payment.service";
import { paystackService, PaystackServiceError } from "./paystack.service";
import type { PaymentInitializationInput } from "../schemas/payment-schema";
import type { PublicPaymentInitializationInput } from "../schemas/public-payment-schema";
import type { PaymentVerificationResult } from "../types";
export class PaymentOrchestrationError extends Error {}

export interface PaymentInitializationResult {
  paymentId: string;
  reference: string;
  authorizationUrl: string;
}

function convertAmountStringToKobo(amount: string): number {
  const trimmed = amount.trim();

  if (!/^\d+(?:\.\d{1,2})?$/.test(trimmed)) {
    throw new PaymentOrchestrationError(
      `Payment amount "${amount}" is not in the expected format.`
    );
  }

  const [naira, kobo = ""] = trimmed.split(".");

  const normalizedKobo = kobo.padEnd(2, "0");

  const totalKobo = Number(naira) * 100 + Number(normalizedKobo);

  if (!Number.isSafeInteger(totalKobo)) {
    throw new PaymentOrchestrationError(
      "Payment amount is outside the supported range."
    );
  }

  return totalKobo;
}

export const paymentOrchestratorService = {
  async initializePayment(
    businessId: string,
    input: PaymentInitializationInput
  ): Promise<PaymentInitializationResult> {
    let payment;
    try {
      payment = await paymentService.initializePayment(businessId, input);
    } catch (err) {
      if (err instanceof PaymentServiceError) {
        throw new PaymentOrchestrationError(err.message);
      }
      throw err;
    }

    if (!payment.customerEmail) {
      throw new PaymentOrchestrationError(
        "This customer has no email on file. Add one before requesting payment."
      );
    }

    const amountInKobo = convertAmountStringToKobo(payment.amount);

    let paystackResponse;
    try {
      paystackResponse = await paystackService.initializeTransaction({
        email: payment.customerEmail,
        amountInKobo,
        reference: payment.reference,
        callbackUrl: `${env.AUTH_URL}/payment/callback`,
      });
    } catch (err) {
      if (err instanceof PaystackServiceError) {
        throw new PaymentOrchestrationError(err.message);
      }
      throw err;
    }

    if (paystackResponse.reference !== payment.reference) {
      throw new PaymentOrchestrationError(
        "Paystack returned a reference that doesn't match this payment. The transaction was not started."
      );
    }

    return {
      paymentId: payment.id,
      reference: payment.reference,
      authorizationUrl: paystackResponse.authorizationUrl,
    };
  },
  async verifyPayment(reference: string): Promise<PaymentVerificationResult> {
    if (!reference || reference.trim().length === 0) {
      throw new PaymentOrchestrationError("Payment reference is required.");
    }

    const normalizedReference = reference.trim();

    let verification;

    try {
      verification =
        await paystackService.verifyTransaction(normalizedReference);
    } catch (err) {
      if (err instanceof PaystackServiceError) {
        throw new PaymentOrchestrationError(err.message);
      }

      throw err;
    }

    if (verification.reference !== normalizedReference) {
      throw new PaymentOrchestrationError(
        "Paystack returned a mismatched payment reference."
      );
    }

    if (verification.currency !== "NGN") {
      throw new PaymentOrchestrationError(
        "This payment was not processed in Nigerian Naira."
      );
    }

    if (verification.status !== "success") {
      return {
        isSuccessful: false,
        reference: normalizedReference,
        message: "Payment was not successful.",
      };
    }

    try {
      await paymentService.markPaymentSuccessful(
        normalizedReference,
        verification.amount
      );
    } catch (err) {
      if (err instanceof PaymentServiceError) {
        throw new PaymentOrchestrationError(err.message);
      }

      throw err;
    }

    return {
      isSuccessful: true,
      reference: normalizedReference,
      message: "Payment verified successfully.",
    };
  },

  /**
   * Public, anonymous-customer orchestration. Identical composition to
   * initializePayment above \u2014 only the payment-service call differs.
   * No Paystack/conversion/reference logic duplicated.
   */
  async initializePublicPayment(
    input: PublicPaymentInitializationInput
  ): Promise<PaymentInitializationResult> {
    let payment;
    try {
      payment = await paymentService.initializePublicPayment(input.publicToken);
    } catch (err) {
      if (err instanceof PaymentServiceError) {
        throw new PaymentOrchestrationError(err.message);
      }
      throw err;
    }

    if (!payment.customerEmail) {
      throw new PaymentOrchestrationError(
        "This invoice has no email on file for the customer. Please contact the business."
      );
    }

    const amountInKobo = convertAmountStringToKobo(payment.amount);

    let paystackResponse;
    try {
      paystackResponse = await paystackService.initializeTransaction({
        email: payment.customerEmail,
        amountInKobo,
        reference: payment.reference,
        callbackUrl: `${env.AUTH_URL}/payment/callback`,
      });
    } catch (err) {
      if (err instanceof PaystackServiceError) {
        throw new PaymentOrchestrationError(err.message);
      }
      throw err;
    }

    if (paystackResponse.reference !== payment.reference) {
      throw new PaymentOrchestrationError(
        "Paystack returned a reference that doesn't match this payment. The transaction was not started."
      );
    }

    return {
      paymentId: payment.id,
      reference: payment.reference,
      authorizationUrl: paystackResponse.authorizationUrl,
    };
  },
};
