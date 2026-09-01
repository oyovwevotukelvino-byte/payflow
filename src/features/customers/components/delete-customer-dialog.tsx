// features/customers/components/delete-customer-dialog.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FormError } from "@/components/shared/forms/form-error";
import { deleteCustomer } from "../actions/delete-customer";

interface DeleteCustomerDialogProps {
  customerId: string;
  customerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCustomerDialog({
  customerId,
  customerName,
  open,
  onOpenChange,
}: DeleteCustomerDialogProps) {
  const router = useRouter();
  const [isDeleting, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const handleDelete = () => {
    setError(undefined);
    startTransition(async () => {
      const result = await deleteCustomer(customerId);
      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  // Clear any stale error if the dialog is reopened for a different customer
  const handleOpenChange = (next: boolean) => {
    if (next) setError(undefined);
    onOpenChange(next);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {customerName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This can&apos;t be undone. Any invoices linked to this customer will keep their record, but you won&apos;t be able to create new ones for them unless you re-add them.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <FormError message={error} />

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting\u2026" : "Delete customer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}