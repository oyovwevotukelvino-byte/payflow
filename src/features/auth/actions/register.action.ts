// features/auth/actions/register.action.ts
"use server";

import { signIn } from "@/auth";
import { registerSchema } from "../schemas/register-schema";
import { authService, AuthServiceError } from "../services/auth.service";
import type { ActionResult } from "@/lib/types/action-result";
import type { PublicUser } from "../services/user.service";

export async function registerAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult<PublicUser>> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let user: PublicUser;

  try {
    user = await authService.register(parsed.data);
  } catch (err) {
    if (err instanceof AuthServiceError) {
      return { success: false, error: err.message, fieldErrors: err.fieldErrors };
    }
    console.error("registerAction: registration failed", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  try {
    // Session creation is a framework concern — lives here, not in the
    // service, per the CTO's approved boundary.
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    // The account exists at this point — sign-in failing here means the
    // user should be directed to log in manually, not told registration
    // failed outright (it didn't; only the auto-login step did).
    console.error("registerAction: post-registration sign-in failed", err);
    return {
      success: false,
      error: "Account created, but automatic sign-in failed. Please sign in.",
    };
  }

  return { success: true, data: user };
}