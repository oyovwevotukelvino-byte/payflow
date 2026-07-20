// features/business/schemas/business-schema.ts
import { z } from "zod";
import { phoneSchema } from "@/lib/validations/phone-schema";

export const businessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters")
    .max(150, "Business name is too long"),
  phone: phoneSchema.optional().or(z.literal("")),
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
  logo: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export type BusinessInput = z.infer<typeof businessSchema>;