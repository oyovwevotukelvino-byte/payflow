// src/components/shared/forms/loading-button.tsx
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

interface LoadingButtonProps extends ComponentProps<typeof Button> {
  isPending: boolean;
  pendingText: string;
}

export function LoadingButton({
  isPending,
  pendingText,
  children,
  disabled,
  className = "",
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || isPending}
      className={`h-11 w-full rounded-lg bg-[var(--pf-brand)] font-medium text-white transition-colors hover:bg-[var(--pf-brand-hover)] focus-visible:ring-2 focus-visible:ring-[var(--pf-brand)]/40 focus-visible:ring-offset-2 disabled:opacity-60 ${className}`}
    >
      {isPending ? pendingText : children}
    </Button>
  );
}