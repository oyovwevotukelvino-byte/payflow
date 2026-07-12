// features/auth/actions/login.action.ts
"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { loginSchema } from "../schemas/login-schema";
import type { ActionResult } from "@/lib/types/action-result";

export async function loginAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult<{ success: true }>> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true, data: { success: true } };
  } catch (err) {
    // Auth.js throws a CredentialsSignin (an AuthError subtype) when
    // authorize() returns null — this is the expected "wrong email or
    // password" case, not a real error. Anything else is unexpected.
    if (err instanceof AuthError) {
      return { success: false, error: "Invalid email or password." };
    }
    console.error("loginAction: unexpected error", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}