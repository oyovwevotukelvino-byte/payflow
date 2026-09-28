// src/features/payments/services/payment.service.ts

import { randomUUID } from "crypto";

import { prisma } from "@/lib/db";

import type { PaymentStatus } from "@prisma/client";

import type { PaymentInitializationInput } from "../schemas/payment-schema";

export class PaymentServiceError extends Error {}

export interface PaymentSummary {
  id: string;
  invoiceId: string;
  reference: string;
  amount: string;
  status: PaymentStatus;
  paidAt: Date | null;
  createdAt: Date;
  customerEmail: string | null;
}

const paymentSelect = {
  id: true,
  invoiceId: true,
  reference: true,
  amount: true,
  status: true,
  paidAt: true,
  createdAt: true,
} as const;

/**
 * Invoice statuses that are allowed to receive payments.
 */
const PAYABLE_STATUSES = ["SENT", "VIEWED", "OVERDUE"] as const;

function generatePaymentReference(): string {
  return `pf_${randomUUID()}`;
}

function convertAmountStringToKobo(amount: string): number {
  const trimmed = amount.trim();

  if (!/^\d+(?:\.\d{1,2})?$/.test(trimmed)) {
    throw new PaymentServiceError(
      `Payment amount "${amount}" is not in the expected format.`
    );
  }

  const [naira, kobo = ""] = trimmed.split(".");

  const normalizedKobo = kobo.padEnd(2, "0");

  const totalKobo = Number(naira) * 100 + Number(normalizedKobo);

  if (!Number.isSafeInteger(totalKobo)) {
    throw new PaymentServiceError(
      "Payment amount is outside the supported range."
    );
  }

  return totalKobo;
}

function isPayableStatus(
  status: string
): status is (typeof PAYABLE_STATUSES)[number] {
  return PAYABLE_STATUSES.includes(status as (typeof PAYABLE_STATUSES)[number]);
}

export const paymentService = {
  /**
   * Initializes a payment for an authenticated business user.
   */
  async initializePayment(
    businessId: string,
    input: PaymentInitializationInput
  ): Promise<PaymentSummary> {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: input.invoiceId,
        businessId,
      },
      select: {
        id: true,
        total: true,
        customerEmail: true,
        status: true,
      },
    });

    if (!invoice) {
      throw new PaymentServiceError(
        "This invoice doesn't belong to your business, or doesn't exist."
      );
    }

    if (!isPayableStatus(invoice.status)) {
      throw new PaymentServiceError(
        "This invoice is not available for payment."
      );
    }

    const existingPending = await prisma.payment.findFirst({
      where: {
        invoiceId: invoice.id,
        status: "PENDING",
      },
      select: paymentSelect,
    });

    if (existingPending) {
      return {
        ...existingPending,
        amount: existingPending.amount.toString(),
        customerEmail: invoice.customerEmail,
      };
    }

    const payment = await prisma.payment.create({
      data: {
        businessId,
        invoiceId: invoice.id,
        amount: invoice.total,
        reference: generatePaymentReference(),
        status: "PENDING",
      },
      select: paymentSelect,
    });

    return {
      ...payment,
      amount: payment.amount.toString(),
      customerEmail: invoice.customerEmail,
    };
  },

  /**
   * Initializes a payment from a public invoice payment link.
   *
   * The public token resolves the invoice internally.
   * The client never provides the business ID.
   *
   * Existing pending payments are reused instead of
   * creating duplicate payment records.
   */
  async initializePublicPayment(publicToken: string): Promise<PaymentSummary> {
    const invoice = await prisma.invoice.findUnique({
      where: {
        publicToken,
      },
      select: {
        id: true,
        businessId: true,
        total: true,
        customerEmail: true,
        status: true,
      },
    });

    if (!invoice) {
      throw new PaymentServiceError("This payment link is invalid.");
    }

    if (!isPayableStatus(invoice.status)) {
      throw new PaymentServiceError(
        "This invoice is not available for payment."
      );
    }

    const existingPending = await prisma.payment.findFirst({
      where: {
        invoiceId: invoice.id,
        status: "PENDING",
      },
      select: paymentSelect,
    });

    if (existingPending) {
      return {
        ...existingPending,
        amount: existingPending.amount.toString(),
        customerEmail: invoice.customerEmail,
      };
    }

    const payment = await prisma.payment.create({
      data: {
        businessId: invoice.businessId,
        invoiceId: invoice.id,
        amount: invoice.total,
        reference: generatePaymentReference(),
        status: "PENDING",
      },
      select: paymentSelect,
    });

    return {
      ...payment,
      amount: payment.amount.toString(),
      customerEmail: invoice.customerEmail,
    };
  },

  /**
   * Marks a verified Paystack payment as successful.
   *
   * The verified Paystack amount must exactly match
   * the amount stored in PayFlow.
   *
   * Payment and invoice updates happen atomically.
   */
  async markPaymentSuccessful(
    reference: string,
    verifiedAmountInKobo: number
  ): Promise<void> {
    const normalizedReference = reference.trim();

    if (!normalizedReference) {
      throw new PaymentServiceError("Payment reference is required.");
    }

    if (
      !Number.isSafeInteger(verifiedAmountInKobo) ||
      verifiedAmountInKobo <= 0
    ) {
      throw new PaymentServiceError("Invalid verified payment amount.");
    }

    const payment = await prisma.payment.findUnique({
      where: {
        reference: normalizedReference,
      },
      select: {
        id: true,
        invoiceId: true,
        amount: true,
        status: true,
        invoice: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!payment) {
      throw new PaymentServiceError("Payment record not found.");
    }

    const expectedAmountInKobo = convertAmountStringToKobo(
      payment.amount.toString()
    );

    if (expectedAmountInKobo !== verifiedAmountInKobo) {
      throw new PaymentServiceError("Payment amount verification failed.");
    }

    /**
     * Idempotency:
     *
     * A successful Paystack payment may be processed more than once
     * because callbacks and webhooks can both reach PayFlow.
     */
    if (payment.status === "SUCCESS") {
      return;
    }

    /**
     * Only a pending payment can transition to SUCCESS.
     */
    if (payment.status !== "PENDING") {
      throw new PaymentServiceError(
        `Payment cannot be marked successful from ${payment.status} status.`
      );
    }

    /**
     * The invoice must still be in a state that can legitimately
     * receive payment.
     */
    if (
      payment.invoice.status !== "SENT" &&
      payment.invoice.status !== "VIEWED" &&
      payment.invoice.status !== "OVERDUE"
    ) {
      throw new PaymentServiceError(
        `Invoice cannot be marked paid from ${payment.invoice.status} status.`
      );
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: {
          id: payment.id,
          status: "PENDING",
        },
        data: {
          status: "SUCCESS",
          paidAt: new Date(),
        },
      }),

      prisma.invoice.update({
        where: {
          id: payment.invoiceId,
          status: payment.invoice.status,
        },
        data: {
          status: "PAID",
        },
      }),
    ]);
  },
};
