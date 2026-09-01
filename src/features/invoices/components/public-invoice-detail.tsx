"use client";

import { useState } from "react";
import type { InvoiceSummary } from "../types";
import { initializePublicPaymentAction } from "@/features/payments/actions/initialize-public-payment";

interface PublicInvoiceDetailProps {
  invoice: InvoiceSummary;
  publicToken: string;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  VIEWED: "Viewed",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function PublicInvoiceDetail({
  invoice,
  publicToken,
}: PublicInvoiceDetailProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PAYABLE_STATUSES = ["SENT", "VIEWED", "OVERDUE"] as const;

 const isPayable = PAYABLE_STATUSES.includes(
  invoice.status as (typeof PAYABLE_STATUSES)[number]
 );
  async function handlePayNow() {
    if (isLoading || !isPayable) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await initializePublicPaymentAction({
        publicToken,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.assign(result.data.authorizationUrl);
    } catch (err) {
      console.error("Public payment initialization failed", err);

      setError(
        "We couldn't start your payment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Invoice
          </p>

          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {invoice.invoiceNumber}
          </h1>
        </div>

        <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
          {STATUS_LABELS[invoice.status] ?? invoice.status}
        </span>
      </div>

      <div className="rounded-xl border border-border p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Billed to
        </p>

        <p className="mt-1 text-sm font-medium text-foreground">
          {invoice.customerName}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="px-3 py-2.5 font-medium text-muted-foreground">
                  Description
                </th>

                <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">
                  Qty
                </th>

                <th className="px-3 py-2.5 text-right font-medium text-muted-foreground">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {invoice.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-3 py-2.5 text-foreground">
                    {item.description}
                  </td>

                  <td className="px-3 py-2.5 text-right text-foreground">
                    {item.quantity}
                  </td>

                  <td className="px-3 py-2.5 text-right font-medium text-foreground">
                    ₦{item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>₦{invoice.subtotal}</span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>
            {invoice.vatEnabled ? "VAT (7.5%)" : "Tax"}
          </span>

          <span>₦{invoice.tax}</span>
        </div>

        <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-foreground">
          <span>Total due</span>
          <span>₦{invoice.total}</span>
        </div>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Due date</span>
        <span>{formatDate(invoice.dueDate)}</span>
      </div>

      {invoice.notes && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Notes
          </p>

          <p className="mt-1 text-sm text-foreground">
            {invoice.notes}
          </p>
        </div>
      )}

      <div className="border-t border-border pt-6">
        {error && (
          <div
            role="alert"
            className="mb-3 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        {isPayable ? (
          <button
            type="button"
            onClick={handlePayNow}
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Connecting to Paystack..." : "Pay Now"}
          </button>
        ) : (
          <div className="rounded-xl bg-muted px-4 py-3 text-center text-sm font-medium text-muted-foreground">
            {invoice.status === "PAID"
              ? "This invoice has already been paid."
              : invoice.status === "CANCELLED"
                ? "This invoice is no longer available for payment."
                : "This invoice is not available for payment yet."}
          </div>
        )}

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Secure payment powered by Paystack
        </p>
      </div>
    </div>
  );
}