// features/customers/schemas/customer-schema.ts
import { z } from "zod";
import { phoneSchema } from "@/lib/validations/phone-schema";

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(150, "Customer name is too long"),
  phone: phoneSchema, // required now \u2014 no .optional().or(z.literal(""))
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .max(255, "Address is too long")
    .optional()
    .or(z.literal("")),
});

export type CustomerInput = z.infer<typeof customerSchema>;