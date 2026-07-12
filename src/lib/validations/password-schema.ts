// src/lib/validations/password-schema.ts
import { z } from "zod";

/**
 * Shared password rules — single source of truth so register (and future
 * reset-password) validation can never drift apart from each other.
 * Lives in src/lib/validations because password rules are a cross-feature
 * concern (auth today; potentially business-user invites, staff accounts
 * later), not something owned by the auth feature specifically.
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[0-9]/, "Include at least one number")
  .refine(
    (value) => value === value.trim(),
    "Password must not start or end with a space"
  );