// features/invoices/components/invoice-list.tsx
import Link from "next/link";
import type { InvoiceSummary } from "../types";

interface InvoiceListProps {
  invoices: InvoiceSummary[];
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

/**
 * Pure display component, mirroring InvoiceDetail's boundary \u2014 receives
 * already-fetched invoices, never calls listInvoicesAction or Prisma
 * itself. Desktop table / mobile cards split matches CustomerTable /
 * CustomerCard's established pattern from Sprint 3.
 */
export function InvoiceList({ invoices }: InvoiceListProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border md:block">
        <table className="w-full text-left">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Invoice</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-border last:border-0">
                <td className="p-0">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="block px-4 py-3 text-sm font-medium text-foreground hover:text-primary"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">{invoice.customerName}</td>
                <td className="px-4 py-3 text-sm text-foreground">₦{invoice.total}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {STATUS_LABELS[invoice.status] ?? invoice.status}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {formatDate(invoice.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {invoices.map((invoice) => (
          <Link
            key={invoice.id}
            href={`/invoices/${invoice.id}`}
            className="block rounded-xl border border-border bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{invoice.invoiceNumber}</p>
              <span className="text-xs font-medium text-muted-foreground">
                {STATUS_LABELS[invoice.status] ?? invoice.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{invoice.customerName}</p>
            <p className="mt-1 text-sm font-medium text-foreground">₦{invoice.total}</p>
            <p className="mt-1 text-xs text-muted-foreground">{formatDate(invoice.createdAt)}</p>
          </Link>
        ))}
      </div>
    </>
  );
}