// features/invoices/components/invoice-form.tsx
"use client";

import { useInvoiceForm } from "../hooks/use-invoice-form";
import { CustomerSelector } from "./customer-selector";
import { InvoiceItemRow } from "./invoice-item-row";
import { InvoiceSummary } from "./invoice-summary";
import { LoadingButton } from "@/components/shared/forms/loading-button";
import { FormError } from "@/components/shared/forms/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { CustomerSummary } from "@/features/customers/types";

interface InvoiceFormProps {
  customers: CustomerSummary[];
}

export function InvoiceForm({ customers }: InvoiceFormProps) {
  const { form, itemsArray, onSubmit, formError, isSubmitting, addItem, removeItem } = useInvoiceForm();
  const { register, watch, setValue, formState: { errors } } = form;
  const watchedItems = watch("items");
  const vatEnabled = watch("vatEnabled");

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <CustomerSelector
        customers={customers}
        value={watch("customerId")}
        onChange={(id) => setValue("customerId", id, { shouldValidate: true })}
        error={errors.customerId?.message}
      />

      <div className="space-y-1.5">
        <Label htmlFor="dueDate">Due date</Label>
        <Input id="dueDate" type="date" {...register("dueDate")} className="h-11" />
        <FormError message={errors.dueDate?.message} />
      </div>

      <div>
        <Label>Items</Label>
        <div className="hidden sm:grid grid-cols-12 gap-2 pb-2 text-xs font-medium text-muted-foreground">
          <span className="col-span-5">Description</span>
          <span className="col-span-2">Qty</span>
          <span className="col-span-2">Unit price</span>
          <span className="col-span-2">Total</span>
          <span className="col-span-1" />
        </div>

        {itemsArray.fields.map((field, index) => (
          <InvoiceItemRow
            key={field.id}
            index={index}
            description={watchedItems[index]?.description ?? ""}
            quantity={watchedItems[index]?.quantity ?? 1}
            unitPrice={String(watchedItems[index]?.unitPrice ?? "")}
            onDescriptionChange={(v) => setValue(`items.${index}.description`, v, { shouldValidate: true })}
            onQuantityChange={(v) => setValue(`items.${index}.quantity`, v, { shouldValidate: true })}
            onUnitPriceChange={(v) => setValue(`items.${index}.unitPrice`, v, { shouldValidate: true })}
            onRemove={() => removeItem(index)}
            canRemove={itemsArray.fields.length > 1}
            errors={{
              description: errors.items?.[index]?.description?.message,
              quantity: errors.items?.[index]?.quantity?.message,
              unitPrice: errors.items?.[index]?.unitPrice?.message,
            }}
          />
        ))}

        <Button type="button" variant="outline" onClick={addItem} className="mt-3 gap-1.5">
          <Plus className="h-4 w-4" />
          Add item
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">
          Notes <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Input id="notes" {...register("notes")} className="h-11" />
        <FormError message={errors.notes?.message} />
      </div>

      <InvoiceSummary
        items={watchedItems.map((i) => ({ quantity: i.quantity, unitPrice: String(i.unitPrice) }))}
        vatEnabled={vatEnabled}
        onVatEnabledChange={(v) => setValue("vatEnabled", v)}
      />

      <FormError message={formError} />

      <LoadingButton type="submit" className="w-full" isPending={isSubmitting} pendingText="Creating invoice…">
        Create invoice
      </LoadingButton>
    </form>
  );
}