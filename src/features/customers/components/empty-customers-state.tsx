// features/customers/components/empty-customers-state.tsx
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCustomersStateProps {
  onAddCustomer: () => void;
}

export function EmptyCustomersState({ onAddCustomer }: EmptyCustomersStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
        <Users className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-foreground">No customers yet.</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Create your first customer to begin sending invoices.
      </p>
      <Button onClick={onAddCustomer} className="mt-2">
        Add Customer
      </Button>
    </div>
  );
}