// app/pay/[token]/page.tsx

import { notFound } from "next/navigation";
import { invoiceService } from "@/features/invoices/services/invoice.service";
import { PublicInvoiceDetail } from "@/features/invoices/components/public-invoice-detail";

interface PayPageProps {
  params: Promise<{ token: string }>;
}

export default async function PayPage({
  params,
}: PayPageProps) {
  const { token } = await params;

  if (!token || token.trim().length === 0) {
    notFound();
  }

  const invoice =
    await invoiceService.getInvoiceByPublicToken(token);

  if (!invoice) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-muted/30 px-4 py-10">
      <div className="mb-6 text-center">
        <p className="text-lg font-semibold tracking-tight text-foreground">
          PayFlow
        </p>
      </div>

      <div className="w-full max-w-md rounded-2xl border  border-border bg-background p-5 shadow-sm">
        <PublicInvoiceDetail
          invoice={invoice}
          publicToken={token}
        />
      </div>
    </main>
  );
}