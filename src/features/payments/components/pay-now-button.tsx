"use client";

import { useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";

import { initializePublicPaymentAction } from "../actions/initialize-public-payment";

interface PayNowButtonProps {
  publicToken: string;
  disabled?: boolean;
}

export function PayNowButton({
  publicToken,
  disabled = false,
}: PayNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePayNow() {
    if (isLoading || disabled) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await initializePublicPaymentAction({
        publicToken,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.href = result.data.authorizationUrl;
    } catch (err) {
      console.error("PayNowButton: payment initialization failed", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handlePayNow}
        disabled={isLoading || disabled}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparing payment...
          </>
        ) : (
          <>
            <LockKeyhole className="h-4 w-4" />
            Pay Now
          </>
        )}
      </button>

      {error && (
        <p
          role="alert"
          className="text-center text-sm text-destructive"
        >
          {error}
        </p>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Secure payment powered by Paystack
      </p>
    </div>
  );
}