// features/customers/components/customers-toolbar.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomerSheet } from "./customer-sheet";
import { EmptyCustomersState } from "./empty-customers-state";

interface CustomersToolbarProps {
  hasCustomers: boolean;
  isSearching: boolean;
}

export function CustomersToolbar({
  hasCustomers,
  isSearching,
}: CustomersToolbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {hasCustomers && (
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Customer
        </Button>
      )}

      {!hasCustomers && !isSearching && (
        <EmptyCustomersState
          onAddCustomer={() => setOpen(true)}
        />
      )}

      <CustomerSheet
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}