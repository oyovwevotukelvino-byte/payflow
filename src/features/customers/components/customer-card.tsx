// features/customers/components/customer-card.tsx
"use client";

import { useState } from "react";
import { Pencil, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerSheet } from "./customer-sheet";

import { DeleteCustomerDialog } from "./delete-customer-dialog";
import type { CustomerSummary } from "../types";

export function CustomerCard({ customer }: { customer: CustomerSummary }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-foreground">{customer.name}</p>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" aria-label={`Edit ${customer.name}`} onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${customer.name}`}
            onClick={() => setDeleteOpen(true)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {customer.phone}
        </p>
        {customer.email && (
          <p className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {customer.email}
          </p>
        )}
        {customer.address && (
          <p className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {customer.address}
          </p>
        )}
      </div>

      <CustomerSheet customer={customer} open={editOpen} onOpenChange={setEditOpen} />

      <DeleteCustomerDialog
        customerId={customer.id}
        customerName={customer.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}