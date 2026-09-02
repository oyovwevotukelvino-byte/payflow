import Link from "next/link";

import { paymentOrchestratorService } from "@/features/payments/services/payment-orchestrator.service";

interface PaymentCallbackPageProps {
  searchParams: Promise<{
    reference?: string;
  }>;
}

interface PaymentResultProps {
  success: boolean;
  title: string;
  message: string;
}

function PaymentResult({
  success,
  title,
  message,
}: PaymentResultProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
        <div
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${
            success
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {success ? "✓" : "✕"}
        </div>

        <h1 className="text-2xl font-semibold">{title}</h1>

        <p className="mt-3 text-sm text-muted-foreground">
          {message}
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Return to PayFlow
        </Link>
      </div>
    </main>
  );
}

export default async function PaymentCallbackPage({
  searchParams,
}: PaymentCallbackPageProps) {
  const { reference } = await searchParams;

  if (!reference) {
    return (
      <PaymentResult
        success={false}
        title="Invalid payment reference"
        message="We could not find a payment reference for this transaction."
      />
    );
  }

  let verificationResult:
    | {
        success: boolean;
        title: string;
        message: string;
      }
    | undefined;

  try {
    const result =
      await paymentOrchestratorService.verifyPayment(reference);

    if (!result.isSuccessful) {
      verificationResult = {
        success: false,
        title: "Payment was not successful",
        message: result.message,
      };
    } else {
      verificationResult = {
        success: true,
        title: "Payment successful",
        message: result.message,
      };
    }
  } catch (error) {
    verificationResult = {
      success: false,
      title: "Payment verification failed",
      message:
        error instanceof Error
          ? error.message
          : "We could not verify your payment. Please contact the business if you were charged.",
    };
  }

  return (
    <PaymentResult
      success={verificationResult.success}
      title={verificationResult.title}
      message={verificationResult.message}
    />
  );
}