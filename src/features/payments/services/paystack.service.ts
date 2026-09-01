// features/payments/services/paystack.service.ts
import { env } from "@/lib/env";
import type { PaystackInitializeResponse, PaystackVerifyResponse } from "../types";

export class PaystackServiceError extends Error {}

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new PaystackServiceError(
      "Paystack is not configured. Set PAYSTACK_SECRET_KEY to enable payments."
    );
  }
  return env.PAYSTACK_SECRET_KEY;
}

const VALID_VERIFY_STATUSES = ["success", "failed", "abandoned"] as const;

function isValidVerifyStatus(
  value: unknown
): value is PaystackVerifyResponse["status"] {
  return (
    typeof value === "string" &&
    (VALID_VERIFY_STATUSES as readonly string[]).includes(value)
  );
}

export const paystackService = {
  /**
   * Initializes a Paystack transaction. Accepts only provider-level
   * inputs \u2014 no businessId, no invoiceId, no PayFlow ownership
   * concepts. amountInKobo is expected to already be a safely-converted
   * integer; this service performs no money conversion itself.
   */
  async initializeTransaction(params: {
    email: string;
    amountInKobo: number;
    reference: string;
    callbackUrl: string;
  }): Promise<PaystackInitializeResponse> {
    const secretKey = getSecretKey();

    let response: Response;
    try {
      response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: params.email,
          amount: params.amountInKobo,
          reference: params.reference,
          callback_url: params.callbackUrl,
        }),
      });
    } catch {
      throw new PaystackServiceError(
        "Could not reach Paystack. Please try again."
      );
    }

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new PaystackServiceError("Paystack returned an unreadable response.");
    }

    if (!response.ok) {
      throw new PaystackServiceError(
        "Paystack rejected the transaction request. Please try again."
      );
    }

    const data =
      typeof body === "object" && body !== null && "data" in body
        ? (body as { data: unknown }).data
        : undefined;

    const authorizationUrl =
      typeof data === "object" && data !== null && "authorization_url" in data
        ? (data as { authorization_url: unknown }).authorization_url
        : undefined;

    const reference =
      typeof data === "object" && data !== null && "reference" in data
        ? (data as { reference: unknown }).reference
        : undefined;

    if (typeof authorizationUrl !== "string" || typeof reference !== "string") {
      throw new PaystackServiceError(
        "Paystack returned an unexpected response shape."
      );
    }

    return {
      authorizationUrl,
      reference,
    };
  },

  /**
   * Verifies a Paystack transaction by reference. Normalizes Paystack's
   * response status into only the three statuses our domain type
   * supports \u2014 no additional statuses are invented.
   */
 async verifyTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  const secretKey = getSecretKey();

  let response: Response;

  try {
    response = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(
        reference
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );
  } catch {
    throw new PaystackServiceError(
      "Could not reach Paystack. Please try again."
    );
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new PaystackServiceError(
      "Paystack returned an unreadable response."
    );
  }

  if (!response.ok) {
    throw new PaystackServiceError(
      "Paystack rejected the verification request. Please try again."
    );
  }

  const data =
    typeof body === "object" &&
    body !== null &&
    "data" in body
      ? (body as { data: unknown }).data
      : undefined;

  const status =
    typeof data === "object" &&
    data !== null &&
    "status" in data
      ? (data as { status: unknown }).status
      : undefined;

  const reference_ =
    typeof data === "object" &&
    data !== null &&
    "reference" in data
      ? (data as { reference: unknown }).reference
      : undefined;

  const amount =
    typeof data === "object" &&
    data !== null &&
    "amount" in data
      ? (data as { amount: unknown }).amount
      : undefined;

  const currency =
    typeof data === "object" &&
    data !== null &&
    "currency" in data
      ? (data as { currency: unknown }).currency
      : undefined;

  if (
    !isValidVerifyStatus(status) ||
    typeof reference_ !== "string" ||
    typeof amount !== "number" ||
    !Number.isSafeInteger(amount) ||
    typeof currency !== "string"
  ) {
    throw new PaystackServiceError(
      "Paystack returned an unexpected verification response."
    );
  }

  return {
    status,
    reference: reference_,
    amount,
    currency,
  };
 },
};