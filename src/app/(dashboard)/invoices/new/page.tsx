// src/app/(dashboard)/invoices/new/page.tsx

import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/get-session";
import { businessService } from "@/features/business/services/business.service";
import { customerService } from "@/features/customers/services/customer.service";
import { InvoiceForm } from "@/features/invoices/components/invoice-form";

export default async function NewInvoicePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const business = await businessService.getBusinessByUser(session.user.id);

  if (!business) {
    redirect("/onboarding/business");
  }

  const customers = await customerService.getCustomers(business.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create invoice
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Add your customer and line items — totals are calculated automatically.
        </p>
      </div>

      <div className="max-w-2xl">
        <InvoiceForm customers={customers} />
      </div>
    </div>
  );
}