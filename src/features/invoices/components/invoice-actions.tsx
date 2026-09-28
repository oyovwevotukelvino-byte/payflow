"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Loader2 } from "lucide-react";

import { markInvoiceAsSentAction } from "../actions/mark-invoice-as-sent";

interface InvoiceActionsProps {
  invoiceId: string;
  status: string;
  publicToken: string;
}

export function InvoiceActions({
  invoiceId,
  status,
  publicToken,
}: InvoiceActionsProps) {
  const [isSending, setIsSending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentUrl = `/pay/${publicToken}`;

  async function handleMarkAsSent() {
    if (isSending) return;

    setIsSending(true);
    setError(null);

    try {
      const result = await markInvoiceAsSentAction(invoiceId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Failed to mark invoice as sent:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(paymentUrl);

      setIsCopied(true);

      window.setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy payment link:", error);

      setError("Unable to copy the payment link.");
    }
  }

  if (status === "DRAFT") {
    return (
      <div className="flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={handleMarkAsSent}
          disabled={isSending}
          className="bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Mark as Sent"
          )}
        </button>

        {error && (
          <p className="text-destructive max-w-xs text-right text-xs">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (status === "SENT" || status === "VIEWED" || status === "OVERDUE") {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2">
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border bg-background text-foreground hover:bg-muted inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          View Payment Page
        </a>

        <button
          type="button"
          onClick={handleCopyLink}
          className="bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Payment Link
            </>
          )}
        </button>

        {error && (
          <p className="text-destructive w-full text-right text-xs">{error}</p>
        )}
      </div>
    );
  }

  if (status === "PAID") {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
        <Check className="h-4 w-4" />
        Payment Received
      </div>
    );
  }

  return null;
}
