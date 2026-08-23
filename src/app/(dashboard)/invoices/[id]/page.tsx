// src/app/(dashboard)/invoices/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth/get-session";
import { businessService } from "@/features/business/services/business.service";
import { getInvoiceAction } from "@/features/invoices/actions/get-invoice";
import { InvoiceDetail } from "@/features/invoices/components/invoice-detail";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const business = await businessService.getBusinessByUser(session.user.id);
  if (!business) redirect("/onboarding/business");

  const { id } = await params;
  const result = await getInvoiceAction(id);

  if (!result.success) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/invoices"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Invoices
      </Link>

      <InvoiceDetail invoice={result.data} />
    </div>
  );
}