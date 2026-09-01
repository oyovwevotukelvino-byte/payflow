// src/features/payments/schemas/payment-schema.ts

import { z } from "zod";

/**
 * Validates authenticated payment initialization.
 *
 * The authenticated business owner provides only the invoice ID.
 * businessId, amount, customerEmail, reference, and status are
 * resolved or generated server-side.
 */
export const initializePaymentSchema = z.object({
  invoiceId: z.string().trim().min(1, "Select an invoice to pay"),
});

export type PaymentInitializationInput = z.infer<
  typeof initializePaymentSchema
>;