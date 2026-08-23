// features/invoices/components/invoice-detail.tsx
import { format } from "date-fns";
import type { InvoiceSummary } from "../types";

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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {invoice.invoiceNumber}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Created {format(new Date(invoice.createdAt), "MMM d, yyyy")}
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
          {STATUS_LABELS[invoice.status] ?? invoice.status}
        </span>
      </div>

      <div className="rounded-xl border border-border p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Bill to
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">{invoice.customerName}</p>
        <p className="text-sm text-muted-foreground">{invoice.customerPhone}</p>
        {invoice.customerEmail && (
          <p className="text-sm text-muted-foreground">{invoice.customerEmail}</p>
        )}
        {invoice.customerAddress && (
          <p className="text-sm text-muted-foreground">{invoice.customerAddress}</p>
        )}
      </div>

      <div className="rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Description</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Qty</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{item.description}</td>
                <td className="px-4 py-3 text-right text-foreground">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-foreground">₦{item.unitPrice}</td>
                <td className="px-4 py-3 text-right font-medium text-foreground">₦{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ml-auto max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>₦{invoice.subtotal}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>{invoice.vatEnabled ? "VAT (7.5%)" : "Tax"}</span>
          <span>₦{invoice.tax}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-1.5 text-base font-semibold text-foreground">
          <span>Total</span>
          <span>₦{invoice.total}</span>
        </div>
      </div>

      {invoice.notes && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Notes
          </p>
          <p className="mt-1 text-sm text-foreground">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}