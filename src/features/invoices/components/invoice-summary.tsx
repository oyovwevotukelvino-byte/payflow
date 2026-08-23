// features/invoices/components/invoice-summary.tsx
"use client";

import { calculateInvoiceTotals, InvoiceCalculationError } from "../utils/invoice-calculations";

interface InvoiceSummaryProps {
  items: Array<{ quantity: number; unitPrice: string }>;
  vatEnabled: boolean;
  onVatEnabledChange: (enabled: boolean) => void;
}

const VAT_RATE_LABEL = "7.5%";

/**
 * Live totals preview \u2014 same calculation engine as the server, same
 * defensive fallback as InvoiceItemRow for an incomplete/invalid
 * in-progress form state.
 */
function previewTotals(items: Array<{ quantity: number; unitPrice: string }>, vatEnabled: boolean) {
  try {
    // Preview-only VAT estimate at the known 7.5% rate. The server is
    // still the sole authority on the persisted tax amount \u2014 this is
    // purely a UI convenience so the user isn't staring at "0.00" while
    // typing. Approximated here rather than importing resolveTax(), since
    // that function currently lives in a file with no "use client"
    // boundary consideration and pulling server-tax-policy into client
    // bundle isn't necessary for a rough live preview.
    const subtotalOnly = calculateInvoiceTotals(items, 0);
    const estimatedTax = vatEnabled
      ? (Number(subtotalOnly.subtotal) * 0.075).toFixed(2)
      : "0.00";
    return calculateInvoiceTotals(items, estimatedTax);
  } catch (err) {
    if (err instanceof InvoiceCalculationError) {
      return { subtotal: "0.00", tax: "0.00", total: "0.00", items: [] };
    }
    throw err;
  }
}

export function InvoiceSummary({ items, vatEnabled, onVatEnabledChange }: InvoiceSummaryProps) {
  const totals = previewTotals(items, vatEnabled);

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={vatEnabled}
          onChange={(e) => onVatEnabledChange(e.target.checked)}
          className="h-4 w-4 rounded border-border"
        />
        Apply VAT ({VAT_RATE_LABEL})
      </label>

      <div className="space-y-1.5 border-t border-border pt-3 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>₦{totals.subtotal}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax {vatEnabled ? `(${VAT_RATE_LABEL})` : ""}</span>
          <span>₦{totals.tax}</span>
        </div>
        <div className="flex justify-between font-semibold text-foreground text-base pt-1.5 border-t border-border">
          <span>Total</span>
          <span>₦{totals.total}</span>
        </div>
      </div>
    </div>
  );
}