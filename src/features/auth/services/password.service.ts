// features/auth/services/password.service.ts
import bcrypt from "bcryptjs";

/**
 * Cost factor 12 — one step above bcrypt's common default of 10.
 * Adds roughly 250ms per hash on typical serverless compute, which is
 * negligible for a login/register request but meaningfully raises the
 * cost of offline brute-force against a leaked hash. Appropriate for a
 * product trending toward handling financial data.
 */
const SALT_ROUNDS = 12;

/**
 * A fixed, pre-computed dummy hash used only for timing-attack mitigation.
 * When a login attempt targets an email that doesn't exist, we still run
 * a bcrypt comparison against this value before returning an error — so
 * "no such user" and "wrong password" take approximately the same amount
 * of time, and an attacker can't distinguish account existence by
 * measuring response latency.
 *
 * This value is not a secret and is never used to authenticate anything —
 * it exists purely to consume the same CPU time a real comparison would.
 */
const DUMMY_HASH =
  "$2a$12$C6UzMDM.H6dfI/f/IKcEeuGrmZ6z9zHrGZKZv0N0z0X0X0X0X0X0X";

export const passwordService = {
  async hash(plainTextPassword: string): Promise<string> {
    return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
  },

  async verify(plainTextPassword: string, storedHash: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, storedHash);
  },

  /**
   * Runs a bcrypt comparison with no real effect on the outcome — used by
   * auth.service.ts specifically when a user lookup fails, so the total
   * request time is indistinguishable from the "user found, wrong password"
   * path. Always returns false; the return value is intentionally unused
   * by callers.
   */
  async compareAgainstDummyHash(plainTextPassword: string): Promise<void> {
    await bcrypt.compare(plainTextPassword, DUMMY_HASH);
  },
};