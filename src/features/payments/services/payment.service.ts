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
const PAYABLE_STATUSES = [
  "SENT",
  "VIEWED",
  "OVERDUE",
] as const;

function generatePaymentReference(): string {
  return `pf_${randomUUID()}`;
}

function convertAmountStringToKobo(amount: string): number {
  const trimmed = amount.trim();

  if (!/^\d+\.\d{2}$/.test(trimmed)) {
    throw new PaymentServiceError(
      `Payment amount "${amount}" is not in the expected format.`
    );
  }

  const [naira, kobo] = trimmed.split(".");

  const totalKobo =
    Number(naira) * 100 + Number(kobo);

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
  return PAYABLE_STATUSES.includes(
    status as (typeof PAYABLE_STATUSES)[number]
  );
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

    const existingPending =
      await prisma.payment.findFirst({
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
  async initializePublicPayment(
    publicToken: string
  ): Promise<PaymentSummary> {
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
      throw new PaymentServiceError(
        "This payment link is invalid."
      );
    }

    if (!isPayableStatus(invoice.status)) {
      throw new PaymentServiceError(
        "This invoice is not available for payment."
      );
    }

    const existingPending =
      await prisma.payment.findFirst({
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
    if (
      !Number.isSafeInteger(verifiedAmountInKobo) ||
      verifiedAmountInKobo <= 0
    ) {
      throw new PaymentServiceError(
        "Invalid verified payment amount."
      );
    }

    const payment = await prisma.payment.findUnique({
      where: {
        reference,
      },
      select: {
        id: true,
        invoiceId: true,
        amount: true,
        status: true,
      },
    });

    if (!payment) {
      throw new PaymentServiceError(
        "Payment record not found."
      );
    }

    const expectedAmountInKobo =
      convertAmountStringToKobo(
        payment.amount.toString()
      );

    if (
      expectedAmountInKobo !==
      verifiedAmountInKobo
    ) {
      throw new PaymentServiceError(
        "Payment amount verification failed."
      );
    }

    /**
     * Idempotency:
     *
     * Paystack verification may happen more than once.
     * If the payment has already succeeded, safely return.
     */
    if (payment.status === "SUCCESS") {
      return;
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          status: "SUCCESS",
          paidAt: new Date(),
        },
      }),

      prisma.invoice.update({
        where: {
          id: payment.invoiceId,
        },
        data: {
          status: "PAID",
        },
      }),
    ]);
  },

  /**
   * Marks a payment as failed.
   *
   * We intentionally do not change the invoice status.
   * The invoice remains payable unless explicitly
   * cancelled or paid through another successful payment.
   */
  async markPaymentFailed(
    reference: string
  ): Promise<void> {
    const payment = await prisma.payment.findUnique({
      where: {
        reference,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!payment) {
      throw new PaymentServiceError(
        "Payment record not found."
      );
    }

    /**
     * Never downgrade a successful payment.
     */
    if (payment.status === "SUCCESS") {
      return;
    }

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "FAILED",
      },
    });
  },
};