// features/invoices/components/invoice-detail.tsx
import { format } from "date-fns";
import type { InvoiceSummary } from "../types";
import { InvoiceActions } from "./invoice-actions";
interface InvoiceDetailProps {
  invoice: InvoiceSummary;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  VIEWED: "Viewed",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

/**
 * Pure display component \u2014 renders exactly what invoiceService already
 * calculated and persisted. Never recalculates subtotal/tax/total itself;
 * the service remains the sole source of financial truth.
 */
export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">
            {invoice.invoiceNumber}
          </h1>

          <p className="text-muted-foreground mt-1 text-sm">
            Created {format(new Date(invoice.createdAt), "MMM d, yyyy")}
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <span className="bg-muted text-foreground rounded-full px-3 py-1 text-sm font-medium">
            {STATUS_LABELS[invoice.status] ?? invoice.status}
          </span>

          <InvoiceActions
            invoiceId={invoice.id}
            status={invoice.status}
            publicToken={invoice.publicToken}
          />
        </div>
      </div>

      <div className="border-border rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Bill to
        </p>
        <p className="text-foreground mt-2 text-sm font-medium">
          {invoice.customerName}
        </p>
        <p className="text-muted-foreground text-sm">{invoice.customerPhone}</p>
        {invoice.customerEmail && (
          <p className="text-muted-foreground text-sm">
            {invoice.customerEmail}
          </p>
        )}
        {invoice.customerAddress && (
          <p className="text-muted-foreground text-sm">
            {invoice.customerAddress}
          </p>
        )}
      </div>

      <div className="border-border rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="border-border bg-muted/40 border-b">
            <tr>
              <th className="text-muted-foreground px-4 py-3 font-medium">
                Description
              </th>
              <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                Qty
              </th>
              <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                Price
              </th>
              <th className="text-muted-foreground px-4 py-3 text-right font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr
                key={item.id}
                className="border-border border-b last:border-0"
              >
                <td className="text-foreground px-4 py-3">
                  {item.description}
                </td>
                <td className="text-foreground px-4 py-3 text-right">
                  {item.quantity}
                </td>
                <td className="text-foreground px-4 py-3 text-right">
                  ₦{item.unitPrice}
                </td>
                <td className="text-foreground px-4 py-3 text-right font-medium">
                  ₦{item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ml-auto max-w-xs space-y-1.5 text-sm">
        <div className="text-muted-foreground flex justify-between">
          <span>Subtotal</span>
          <span>₦{invoice.subtotal}</span>
        </div>
        <div className="text-muted-foreground flex justify-between">
          <span>{invoice.vatEnabled ? "VAT (7.5%)" : "Tax"}</span>
          <span>₦{invoice.tax}</span>
        </div>
        <div className="border-border text-foreground flex justify-between border-t pt-1.5 text-base font-semibold">
          <span>Total</span>
          <span>₦{invoice.total}</span>
        </div>
      </div>

      {invoice.notes && (
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Notes
          </p>
          <p className="text-foreground mt-1 text-sm">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}
