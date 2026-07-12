// src/components/shared/forms/loading-button.tsx
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

interface LoadingButtonProps extends ComponentProps<typeof Button> {
  isPending: boolean;
  pendingText: string;
}

/**
 * Shared across every feature's forms (Auth today; Business, Customer,
 * Invoice, Payment forms later). Owns exactly one concern: swap label and
 * disable while a Server Action is pending.
 */
export function LoadingButton({
  isPending,
  pendingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={disabled || isPending}>
      {isPending ? pendingText : children}
    </Button>
  );
}