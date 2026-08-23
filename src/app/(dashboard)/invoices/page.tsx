// src/app/(dashboard)/invoices/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { getSession } from "@/lib/auth/get-session";
import { businessService } from "@/features/business/services/business.service";
import { listInvoicesAction } from "@/features/invoices/actions/list-invoices";
import { InvoiceList } from "@/features/invoices/components/invoice-list";
import { Button } from "@/components/ui/button";

export default async function InvoicesPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const business = await businessService.getBusinessByUser(session.user.id);

  if (!business) {
    redirect("/onboarding/business");
  }

  const result = await listInvoicesAction();

  if (!result.success) {
    throw new Error(result.error);
  }

  const invoices = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Invoices
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create, view, and manage your invoices.
          </p>
        </div>

        <Button asChild className="shrink-0 gap-1.5">
          <Link href="/invoices/new">
            <Plus className="h-4 w-4" />
            Create invoice
          </Link>
        </Button>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            No invoices yet.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Create your first invoice to get paid faster.
          </p>

          <Button asChild className="mt-4">
            <Link href="/invoices/new">Create invoice</Link>
          </Button>
        </div>
      ) : (
        <InvoiceList invoices={invoices} />
      )}
    </div>
  );
}