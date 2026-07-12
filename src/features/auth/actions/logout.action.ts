// features/auth/actions/logout.action.ts
"use server";

import { signOut } from "@/auth";

export async function logoutAction(): Promise<void> {
  // No ActionResult here deliberately — logout has no meaningful failure
  // mode from the user's perspective, and signOut() handles its own
  // redirect. A form calling this directly needs no error-handling UI.
  await signOut({ redirectTo: "/sign-in" });
}