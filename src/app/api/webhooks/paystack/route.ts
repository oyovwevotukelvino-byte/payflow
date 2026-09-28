// src/app/api/webhooks/paystack/route.ts

import crypto from "node:crypto";

import { env } from "@/lib/env";
import {
  PaymentServiceError,
  paymentService,
} from "@/features/payments/services/payment.service";

interface PaystackWebhookPayload {
  event?: string;
  data?: {
    reference?: string;
    amount?: number;
    currency?: string;
    status?: string;
  };
}

function isPaystackWebhookPayload(
  value: unknown
): value is PaystackWebhookPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  if ("event" in payload && typeof payload.event !== "string") {
    return false;
  }

  if ("data" in payload && payload.data !== undefined) {
    if (
      typeof payload.data !== "object" ||
      payload.data === null ||
      Array.isArray(payload.data)
    ) {
      return false;
    }

    const data = payload.data as Record<string, unknown>;

    if (
      "reference" in data &&
      data.reference !== undefined &&
      typeof data.reference !== "string"
    ) {
      return false;
    }

    if (
      "amount" in data &&
      data.amount !== undefined &&
      typeof data.amount !== "number"
    ) {
      return false;
    }

    if (
      "currency" in data &&
      data.currency !== undefined &&
      typeof data.currency !== "string"
    ) {
      return false;
    }

    if (
      "status" in data &&
      data.status !== undefined &&
      typeof data.status !== "string"
    ) {
      return false;
    }
  }

  return true;
}

function isValidSignature(
  rawBody: string,
  signature: string,
  secretKey: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return Response.json(
        {
          success: false,
          message: "Missing Paystack signature.",
        },
        { status: 401 }
      );
    }

    const rawBody = await request.text();

    if (!isValidSignature(rawBody, signature, env.PAYSTACK_SECRET_KEY)) {
      return Response.json(
        {
          success: false,
          message: "Invalid Paystack signature.",
        },
        { status: 401 }
      );
    }

    let parsedPayload: unknown;

    try {
      parsedPayload = JSON.parse(rawBody);
    } catch {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON payload.",
        },
        { status: 400 }
      );
    }

    if (!isPaystackWebhookPayload(parsedPayload)) {
      return Response.json(
        {
          success: false,
          message: "Invalid webhook payload.",
        },
        { status: 400 }
      );
    }

    const payload = parsedPayload;

    /**
     * PayFlow currently only processes successful charges.
     *
     * Other Paystack events are acknowledged so Paystack
     * does not repeatedly retry events that PayFlow
     * intentionally does not handle.
     */
    if (payload.event !== "charge.success") {
      return Response.json({
        success: true,
        message: "Event received.",
      });
    }

    const reference = payload.data?.reference;
    const amount = payload.data?.amount;
    const currency = payload.data?.currency;
    const status = payload.data?.status;

    if (
      typeof reference !== "string" ||
      reference.trim().length === 0 ||
      typeof amount !== "number" ||
      !Number.isSafeInteger(amount) ||
      amount <= 0 ||
      currency !== "NGN" ||
      status !== "success"
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid payment event payload.",
        },
        { status: 400 }
      );
    }

    await paymentService.markPaymentSuccessful(reference.trim(), amount);

    return Response.json({
      success: true,
      message: "Payment processed successfully.",
    });
  } catch (error) {
    if (error instanceof PaymentServiceError) {
      console.warn("Paystack webhook payment error:", error);

      return Response.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      );
    }

    console.error("Paystack webhook error:", error);

    return Response.json(
      {
        success: false,
        message: "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}
