// features/customers/components/customer-table.tsx
import { CustomerRow } from "./customer-row";
import type { CustomerSummary } from "../types";

export function CustomerTable({ customers }: { customers: CustomerSummary[] }) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border md:block">
      <table className="w-full text-left">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Phone</th>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
            <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Address</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <CustomerRow key={customer.id} customer={customer} />
          ))}
        </tbody>
      </table>
    </div>
  );
}