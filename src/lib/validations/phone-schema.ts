// src/lib/validations/phone-schema.ts
import { z } from "zod";

/**
 * Nigerian phone number validation — structural shape only, not carrier
 * prefix validation. Prefix blocks shift as the NCC reallocates ranges to
 * networks over time; validating shape avoids that maintenance burden.
 * Lives in src/lib/validations since Customer and Business features will
 * also need to validate Nigerian phone numbers, not just Auth.
 *
 * Accepts: 08012345678, +2348012345678, 2348012345678
 */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^(?:\+?234|0)\d{10}$/, "Enter a valid Nigerian phone number");