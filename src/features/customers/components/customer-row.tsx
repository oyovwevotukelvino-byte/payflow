// features/customers/components/customer-row.tsx
"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomerSheet } from "./customer-sheet";
import { Button } from "@/components/ui/button";

import { DeleteCustomerDialog } from "./delete-customer-dialog";
import type { CustomerSummary } from "../types";

export function CustomerRow({ customer }: { customer: CustomerSummary }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 text-sm font-medium text-foreground">{customer.name}</td>
      <td className="px-4 py-3 text-sm text-foreground">{customer.phone}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{customer.email || "\u2014"}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{customer.address || "\u2014"}</td>
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Actions for ${customer.name}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setDeleteOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>

      <CustomerSheet customer={customer} open={editOpen} onOpenChange={setEditOpen} />

      <DeleteCustomerDialog
        customerId={customer.id}
        customerName={customer.name}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </tr>
  );
}