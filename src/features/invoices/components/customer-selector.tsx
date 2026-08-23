// features/invoices/components/customer-selector.tsx
import type { CustomerSummary } from "@/features/customers/types";

interface CustomerSelectorProps {
  customers: CustomerSummary[];
  value: string;
  onChange: (customerId: string) => void;
  error?: string;
}

/**
 * Receives customers as a prop, fetched server-side by whichever page
 * mounts this form \u2014 keeps this component pure, matching the pattern
 * already used for BusinessForm's states list and CustomerForm's
 * pre-fill data.
 */
export function CustomerSelector({ customers, value, onChange, error }: CustomerSelectorProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
        You don&apos;t have any customers yet.{" "}
        <a href="/customers" className="font-medium text-primary underline-offset-4 hover:underline">
          Add one first
        </a>{" "}
        to create an invoice.
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor="customerId" className="text-sm font-medium text-foreground">
        Customer
      </label>
      <select
        id="customerId"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-11 w-full rounded-lg border border-border bg-transparent px-3.5 text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">Select a customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} — {customer.phone}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}