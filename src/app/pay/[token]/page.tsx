// app/pay/[token]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { invoiceService } from "@/features/invoices/services/invoice.service";
import { PublicInvoiceDetail } from "@/features/invoices/components/public-invoice-detail";

interface PayPageProps {
  params: Promise<{ token: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
  const { token } = await params;

  if (!token || token.trim().length === 0) {
    notFound();
  }

  const invoice = await invoiceService.getInvoiceByPublicToken(token);

  if (!invoice) {
    notFound();
  }

  return (
    <main className="bg-muted/30 flex min-h-screen flex-col items-center px-4 py-10">
      <div className="mb-6">
        <Image
          src="/payflow-logo.svg"
          alt="PayFlow"
          width={150}
          height={42}
          priority
        />
      </div>

      <div className="border-border bg-background w-full max-w-md rounded-2xl border p-5 shadow-sm">
        <PublicInvoiceDetail invoice={invoice} publicToken={token} />
      </div>
    </main>
  );
}
