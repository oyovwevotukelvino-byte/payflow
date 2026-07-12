// features/auth/components/password-field.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  autoComplete: "new-password" | "current-password";
}

/**
 * Kept local to features/auth for now — only Register and Login consume
 * it. Promote to src/components/shared/forms/ the moment a second feature
 * (e.g. Reset Password) needs it, per the trade-off noted above.
 */
export function PasswordField({ id, name, label, autoComplete }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          className="pr-10"
        />
        <button
          type="button"
          tabIndex={0}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-pressed={visible}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
