// features/auth/schemas/register-schema.ts
import { z } from "zod";
import { passwordSchema } from "@/lib/validations/password-schema";
import { phoneSchema } from "@/lib/validations/phone-schema";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long")
      .transform((value) => value.replace(/\s+/g, " ")),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address")
      .max(254, "Email is too long"),
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;