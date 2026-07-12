// features/auth/services/auth.service.ts
import { userService } from "./user.service";
import { passwordService } from "./password.service";
import { registerSchema, type RegisterInput } from "../schemas/register-schema";
import { loginSchema } from "../schemas/login-schema";
import type { PublicUser } from "./user.service";

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors?: Record<string, string[]>
  ) {
    super(message);
  }
}

export const authService = {
  async register(input: RegisterInput): Promise<PublicUser> {
    // input is already validated by the Server Action (registerSchema),
    // since registration has field-specific errors the UI needs mapped
    // to individual inputs — see trade-off note below on why register()
    // keeps that split while validateCredentials() below does not.
    const alreadyExists = await userService.existsByEmail(input.email);

    if (alreadyExists) {
      throw new AuthServiceError(
        "This email is already registered. Please sign in instead."
      );
    }

    const passwordHash = await passwordService.hash(input.password);

    return userService.create(
      { name: input.name, email: input.email, phoneNumber: input.phoneNumber },
      passwordHash
    );
  },

  /**
   * Single entry point for authentication. Accepts raw, unvalidated input
   * (unknown shape) so any caller — Auth.js's authorize(), a future REST
   * endpoint, a future mobile client — can hand this whatever it received
   * and get back a definitive PublicUser | null, with validation, lookup,
   * and verification all handled here. Callers never call loginSchema
   * themselves.
   */
  async validateCredentials(rawInput: unknown): Promise<PublicUser | null> {
    const parsed = loginSchema.safeParse(rawInput);
    if (!parsed.success) return null;

    const { email, password } = parsed.data;
    const user = await userService.findByEmail(email);

    if (!user || !user.passwordHash) {
      await passwordService.compareAgainstDummyHash(password);
      return null;
    }

    const isValid = await passwordService.verify(password, user.passwordHash);
    if (!isValid) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
  },
};