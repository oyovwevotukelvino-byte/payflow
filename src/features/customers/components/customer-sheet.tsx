// features/customers/components/customer-sheet.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { CustomerForm } from "./customer-form";
import type { CustomerSummary } from "../types";

interface CustomerSheetProps {
  customer?: CustomerSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerSheet({
  customer,
  open,
  onOpenChange,
}: CustomerSheetProps) {
  const isEditing = Boolean(customer);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle>
            {isEditing ? "Edit Customer" : "Add Customer"}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <CustomerForm
            customer={customer}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}