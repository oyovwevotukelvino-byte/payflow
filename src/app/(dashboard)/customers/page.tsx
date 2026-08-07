// app/(dashboard)/customers/page.tsx — corrected
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { businessService } from "@/features/business/services/business.service";
import { customerService } from "@/features/customers/services/customer.service";
import { CustomerTable } from "@/features/customers/components/customer-table";
import { CustomerCard } from "@/features/customers/components/customer-card";
import { SearchInput } from "@/features/customers/components/search-input";
import { CustomersToolbar } from "@/features/customers/components/customers-toolbar";

interface CustomersPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const business = await businessService.getBusinessByUser(session.user.id);
  if (!business) redirect("/onboarding/business");

  const { q } = await searchParams;
  const customers = q
    ? await customerService.searchCustomers(business.id, q)
    : await customerService.getCustomers(business.id);

  const hasCustomers = customers.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Customers</h1>
        {hasCustomers && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput />
          </div>
        )}
      </div>

      <CustomersToolbar
     hasCustomers={hasCustomers}
     isSearching={Boolean(q)}
     />

      {hasCustomers && (
        <>
          <CustomerTable customers={customers} />
          <div className="space-y-3 md:hidden">
            {customers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}