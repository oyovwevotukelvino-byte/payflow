// src/app/payment/callback/page.tsx
import Link from "next/link";

import {
  paymentOrchestratorService,
  PaymentOrchestrationError,
} from "@/features/payments/services/payment-orchestrator.service";

interface PaymentCallbackPageProps {
  searchParams: Promise<{
    reference?: string;
  }>;
}

interface PaymentResultProps {
  success: boolean;
  title: string;
  message: string;
  reference?: string;
}

function PaymentResult({
  success,
  title,
  message,
  reference,
}: PaymentResultProps) {
  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center px-4 py-10">
      <section className="bg-background w-full max-w-md rounded-2xl border p-8 text-center shadow-sm">
        <p className="text-lg font-semibold">PayFlow</p>

        <div
          className={`mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full text-3xl font-bold ${
            success
              ? "bg-green-100 text-green-600"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {success ? "✓" : "!"}
        </div>

        <h1 className="mt-6 text-2xl font-semibold">{title}</h1>

        <p className="text-muted-foreground mt-3 text-sm leading-6">
          {message}
        </p>

        {reference && (
          <p className="text-muted-foreground mt-5 text-xs break-all">
            Payment reference:
            <br />
            {reference}
          </p>
        )}

        <Link
          href="/"
          className="bg-primary text-primary-foreground mt-8 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          Return to PayFlow
        </Link>
      </section>
    </main>
  );
}

export default async function PaymentCallbackPage({
  searchParams,
}: PaymentCallbackPageProps) {
  const { reference } = await searchParams;

  if (!reference?.trim()) {
    return (
      <PaymentResult
        success={false}
        title="Payment reference missing"
        message="We couldn't verify this payment because the payment reference is missing."
      />
    );
  }

  let success = false;
  let title = "Payment verification failed";
  let message =
    "We couldn't verify your payment. Please contact the business if you completed the payment.";
  let verifiedReference = reference;

  try {
    const result = await paymentOrchestratorService.verifyPayment(reference);

    success = result.isSuccessful;
    verifiedReference = result.reference;

    if (result.isSuccessful) {
      title = "Payment successful";
      message = result.message;
    } else {
      title = "Payment was not successful";
      message = result.message;
    }
  } catch (error) {
    console.error("Payment callback verification failed:", error);

    message =
      error instanceof PaymentOrchestrationError
        ? error.message
        : "We couldn't verify your payment. Please contact the business if you completed the payment.";
  }

  return (
    <PaymentResult
      success={success}
      title={title}
      message={message}
      reference={verifiedReference}
    />
  );
}
