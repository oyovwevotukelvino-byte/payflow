// src/features/payments/schemas/public-payment-schema.ts

import { z } from "zod";

export const initializePublicPaymentSchema = z.object({
  publicToken: z
    .string()
    .trim()
    .min(1, "Invoice link is required"),
});

export type PublicPaymentInitializationInput = z.infer<
  typeof initializePublicPaymentSchema
>;