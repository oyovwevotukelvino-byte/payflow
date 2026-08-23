// features/invoices/constants/invoice.constants.ts

/**
 * ASSUMPTION, NOT A CONFIRMED LOCK: this exact format ("INV-" + 6-digit
 * zero-padded sequence) appeared as an *example* across multiple CTO
 * documents but was never explicitly stated as a final decision the way
 * vatEnabled or payment cardinality were. Isolated here per the Phase 2D
 * spec's own instruction, so it's a one-file change if a different
 * prefix/padding gets confirmed later \u2014 flagging for explicit
 * confirmation rather than treating it as settled.
 */
export const INVOICE_NUMBER_PREFIX = "INV-";
export const INVOICE_NUMBER_PADDING = 6;

export function formatInvoiceNumber(sequence: number): string {
  return `${INVOICE_NUMBER_PREFIX}${sequence.toString().padStart(INVOICE_NUMBER_PADDING, "0")}`;
}