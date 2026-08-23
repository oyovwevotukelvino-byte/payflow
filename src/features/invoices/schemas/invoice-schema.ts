import { z } from "zod";

const invoiceItemSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(200, "Description is too long"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be at least 1"),

  unitPrice: z
    .union([z.number(), z.string()])
    .refine(
      (val) =>
        /^\d{1,10}(\.\d{1,2})?$/.test(val.toString()),
      "Enter a valid price with at most 2 decimal places"
    ),
});

export const createInvoiceSchema = z.object({
  customerId: z.string().min(1, "Select a customer"),

  items: z
    .array(invoiceItemSchema)
    .min(1, "An invoice needs at least one item"),

  // features/invoices/schemas/invoice-schema.ts — dueDate field, final version
dueDate: z
  .union([z.string(), z.date()])
  .transform((val) => (typeof val === "string" ? new Date(val) : val))
  .refine((date) => !Number.isNaN(date.getTime()), "Enter a valid due date"),

  notes: z
    .string()
    .trim()
    .max(1000, "Notes are too long")
    .optional(),

  vatEnabled: z.boolean(),
});

export type CreateInvoiceInput = z.infer<
  typeof createInvoiceSchema
>;