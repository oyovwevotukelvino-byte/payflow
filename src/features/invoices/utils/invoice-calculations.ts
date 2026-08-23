// features/invoices/utils/invoice-calculations.ts

/**
 * Pure calculation domain for the Invoice feature. No Prisma, no React,
 * no Next.js — safe to import from both the server (invoice.service.ts,
 * for authoritative recalculation) and the client (invoice form, for a
 * live preview), guaranteeing both sides compute totals identically.
 *
 * All monetary arithmetic uses BigInt exclusively. No Number is ever
 * multiplied, added, or divided when a monetary magnitude is involved —
 * Number is only used for the (validated, safe-integer) quantity input.
 */

export class InvoiceCalculationError extends Error {}

export interface LineItemCalculationInput {
  quantity: number;
  unitPrice: number | string;
}

export interface LineItemCalculationResult {
  quantity: number;
  unitPrice: string;
  lineTotal: string;
}

export interface InvoiceCalculationResult {
  items: LineItemCalculationResult[];
  subtotal: string;
  tax: string;
  total: string;
}

/** Matches Decimal(12,2): up to 10 integer digits, optional 1-2 decimal digits, non-negative. */
const MONETARY_PATTERN = /^\d{1,10}(\.\d{1,2})?$/;

/** 9,999,999,999.99 expressed as an integer count of kobo — the true Decimal(12,2) ceiling
 *  (12 total digits \u2212 2 reserved for the fraction = 10 integer digits, not 12). */
const MAX_MINOR_UNITS = 999999999999n;

function toMinorUnitsBigInt(value: number | string, fieldName: string): bigint {
  if (typeof value === "number" && !Number.isFinite(value)) {
    throw new InvoiceCalculationError(
      `Invalid ${fieldName}: ${value}. NaN and Infinity are not valid monetary values.`
    );
  }

  const raw = typeof value === "number" ? value.toString() : value.trim();

  if (!MONETARY_PATTERN.test(raw)) {
    throw new InvoiceCalculationError(
      `Invalid ${fieldName}: "${value}". Expected a non-negative number with at most 2 decimal places and at most 10 integer digits.`
    );
  }

  const [wholePart, fractionPart = ""] = raw.split(".");
  const paddedFraction = fractionPart.padEnd(2, "0");

  const minorUnits = BigInt(wholePart) * 100n + BigInt(paddedFraction);

  if (minorUnits > MAX_MINOR_UNITS) {
    throw new InvoiceCalculationError(
      `Invalid ${fieldName}: "${value}" exceeds the maximum supported value of 9999999999.99.`
    );
  }

  return minorUnits;
}

function fromMinorUnitsBigInt(minorUnits: bigint): string {
  const digits = minorUnits.toString().padStart(3, "0");
  const wholePart = digits.slice(0, -2);
  const fractionPart = digits.slice(-2);
  return `${wholePart}.${fractionPart}`;
}

function assertValidQuantity(quantity: number): void {
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new InvoiceCalculationError(
      `Invalid quantity: ${quantity}. Expected a positive safe whole number.`
    );
  }
}

function assertWithinRange(minorUnits: bigint, fieldName: string): void {
  if (minorUnits > MAX_MINOR_UNITS) {
    throw new InvoiceCalculationError(
      `Calculated ${fieldName} exceeds the maximum supported value of 9999999999.99.`
    );
  }
}

export function calculateLineTotal(
  item: LineItemCalculationInput
): LineItemCalculationResult {
  assertValidQuantity(item.quantity);

  const unitPriceMinor = toMinorUnitsBigInt(item.unitPrice, "unitPrice");
  const lineTotalMinor = unitPriceMinor * BigInt(item.quantity);

  assertWithinRange(lineTotalMinor, "lineTotal");

  return {
    quantity: item.quantity,
    unitPrice: fromMinorUnitsBigInt(unitPriceMinor),
    lineTotal: fromMinorUnitsBigInt(lineTotalMinor),
  };
}

export function calculateInvoiceTotals(
  items: LineItemCalculationInput[],
  taxAmount: number | string = 0
): InvoiceCalculationResult {
  const calculatedItems = items.map(calculateLineTotal);

  const subtotalMinor = calculatedItems.reduce(
    (sum, item) => sum + toMinorUnitsBigInt(item.lineTotal, "lineTotal"),
    0n
  );
  assertWithinRange(subtotalMinor, "subtotal");

  const taxMinor = toMinorUnitsBigInt(taxAmount, "tax");

  const totalMinor = subtotalMinor + taxMinor;
  assertWithinRange(totalMinor, "total");

  return {
    items: calculatedItems,
    subtotal: fromMinorUnitsBigInt(subtotalMinor),
    tax: fromMinorUnitsBigInt(taxMinor),
    total: fromMinorUnitsBigInt(totalMinor),
  };
}

/**
 * Additive only — does not alter the previously approved public API.
 * Computes `ratePercent`% of `amount`, entirely in BigInt, rounding
 * half-up to the nearest kobo. Exists so invoice-tax.ts (Phase 2A) never
 * needs to re-implement kobo parsing/rounding independently.
 */
export function calculatePercentageOf(
  amount: number | string,
  ratePercent: number | string
): string {
  const amountMinor = toMinorUnitsBigInt(amount, "amount");

  const rateRaw = typeof ratePercent === "number" ? ratePercent.toString() : ratePercent.trim();
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(rateRaw)) {
    throw new InvoiceCalculationError(
      `Invalid ratePercent: "${ratePercent}". Expected a non-negative percentage with at most 2 decimal places.`
    );
  }
  const [rateWhole, rateFraction = ""] = rateRaw.split(".");
  const rateBasisPoints = BigInt(rateWhole) * 100n + BigInt(rateFraction.padEnd(2, "0"));

  // Round half-up to the nearest kobo: (amount \u00d7 rateBasisPoints + 5000) / 10000
  const numerator = amountMinor * rateBasisPoints;
  const resultMinor = (numerator + 5000n) / 10000n;

  assertWithinRange(resultMinor, "percentage amount");

  return fromMinorUnitsBigInt(resultMinor);
}