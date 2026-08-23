// features/invoices/utils/invoice-tax.ts

/**
 * VAT policy for Nigerian invoices. Deliberately separate from
 * invoice-calculations.ts: this file decides *whether* VAT applies and
 * *at what rate*; invoice-calculations.ts performs the actual monetary
 * arithmetic. Pure, dependency-free \u2014 no Prisma, no React, no Next.js.
 */

import { calculatePercentageOf } from "./invoice-calculations";

/** Locked Nigerian VAT rate for Sprint 4. Not user-configurable. */
export const VAT_RATE = "7.5";

/**
 * Computes the VAT amount on a subtotal at the locked rate. Delegates
 * all BigInt/rounding work to invoice-calculations.ts \u2014 this function
 * contains zero monetary arithmetic of its own.
 */
export function calculateVat(subtotal: number | string): string {
  return calculatePercentageOf(subtotal, VAT_RATE);
}

/**
 * The actual policy decision the invoice service will call: given
 * whether VAT is enabled for this invoice, resolves the authoritative
 * tax amount. This is the one place "vatEnabled boolean \u2192 tax value"
 * logic lives, so Phase 2D's service never has to re-decide it inline.
 */
export function resolveTax(subtotal: number | string, vatEnabled: boolean): string {
  return vatEnabled ? calculateVat(subtotal) : "0.00";
}