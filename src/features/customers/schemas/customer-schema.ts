import { z } from "zod";
import { phoneSchema } from "@/lib/validations/phone-schema";

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(150),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .optional()
    .or(z.literal("")),

  phone: phoneSchema.optional().or(z.literal("")),

  address: z
    .string()
    .trim()
    .max(255)
    .optional()
    .or(z.literal("")),
});

export type CustomerInput = z.infer<typeof customerSchema>;