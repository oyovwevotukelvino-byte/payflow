// src/features/payments/types/index.ts

export type { PaymentInitializationInput } from "../schemas/payment-schema";

export type { PublicPaymentInitializationInput } from "../schemas/public-payment-schema";

export interface PaystackInitializeResponse {
  authorizationUrl: string;
  reference: string;
}

export interface PaystackVerifyResponse {
  status: "success" | "failed" | "abandoned";
  reference: string;
  amount: number;
  currency: string;
}

export interface PaymentVerificationResult {
  isSuccessful: boolean;
  reference: string;
  message: string;
}