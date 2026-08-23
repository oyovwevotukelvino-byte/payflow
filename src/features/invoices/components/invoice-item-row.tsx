// features/invoices/components/invoice-item-row.tsx
"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateLineTotal, InvoiceCalculationError } from "../utils/invoice-calculations";

interface InvoiceItemRowProps {
  index: number;
  description: string;
  quantity: number;
  unitPrice: string;
  onDescriptionChange: (value: string) => void;
  onQuantityChange: (value: number) => void;
  onUnitPriceChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  errors?: { description?: string; quantity?: string; unitPrice?: string };
}

/**
 * Live per-row total, computed with the exact same function the server
 * will use \u2014 not a reimplementation. Wrapped defensively since a
 * mid-typing state (empty unitPrice, quantity 0) is expected and
 * shouldn't throw a visible error while the user is still filling the row in.
 */
function previewLineTotal(quantity: number, unitPrice: string): string {
  try {
    return calculateLineTotal({ quantity, unitPrice }).lineTotal;
  } catch (err) {
    if (err instanceof InvoiceCalculationError) return "\u2014";
    throw err;
  }
}

export function InvoiceItemRow({
  description,
  quantity,
  unitPrice,
  onDescriptionChange,
  onQuantityChange,
  onUnitPriceChange,
  onRemove,
  canRemove,
  errors,
}: InvoiceItemRowProps) {
  const lineTotal = previewLineTotal(quantity, unitPrice);

  return (
    <div className="grid grid-cols-12 gap-2 items-start border-b border-border py-3 last:border-0">
      <div className="col-span-12 sm:col-span-5">
        <Input
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Description"
          className="h-10"
        />
        {errors?.description && <p className="mt-1 text-xs text-destructive">{errors.description}</p>}
      </div>

      <div className="col-span-4 sm:col-span-2">
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
          className="h-10"
        />
        {errors?.quantity && <p className="mt-1 text-xs text-destructive">{errors.quantity}</p>}
      </div>

      <div className="col-span-5 sm:col-span-2">
        <Input
          value={unitPrice}
          onChange={(e) => onUnitPriceChange(e.target.value)}
          placeholder="0.00"
          className="h-10"
        />
        {errors?.unitPrice && <p className="mt-1 text-xs text-destructive">{errors.unitPrice}</p>}
      </div>

      <div className="col-span-2 sm:col-span-2 flex h-10 items-center text-sm font-medium text-foreground">
        ₦{lineTotal}
      </div>

      <div className="col-span-1 flex h-10 items-center justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}