// features/customers/services/customer.service.ts
import { prisma } from "@/lib/db";
import type { CustomerInput } from "../schemas/customer-schema";

export class CustomerServiceError extends Error {}

export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  createdAt: Date;
}

const customerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  createdAt: true,
} as const;

export const customerService = {
  /**
   * Creates a customer under the given business. businessId must already
   * be resolved from the authenticated session by the caller (a Server
   * Action) — this method trusts it as given, and never derives it from
   * client input itself.
   */
  async createCustomer(businessId: string, input: CustomerInput): Promise<Customer> {
    return prisma.customer.create({
      data: {
        businessId,
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        address: input.address || null,
      },
      select: customerSelect,
    });
  },

  /**
   * Updates a customer, scoped to businessId — the compound where clause
   * ensures a customerId belonging to a different business simply won't
   * match, rather than silently updating the wrong tenant's data.
   */
  async updateCustomer(
    businessId: string,
    customerId: string,
    input: CustomerInput
  ): Promise<Customer> {
    const result = await prisma.customer.updateMany({
      where: { id: customerId, businessId },
      data: {
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        address: input.address || null,
      },
    });

    if (result.count === 0) {
      throw new CustomerServiceError("Customer not found.");
    }

    const updated = await prisma.customer.findUnique({
      where: { id: customerId },
      select: customerSelect,
    });

    if (!updated) {
      throw new CustomerServiceError("Customer not found.");
    }

    return updated;
  },

  /**
   * Deletes a customer, same businessId-scoped safety as update.
   */
  async deleteCustomer(businessId: string, customerId: string): Promise<void> {
    const result = await prisma.customer.deleteMany({
      where: { id: customerId, businessId },
    });

    if (result.count === 0) {
      throw new CustomerServiceError("Customer not found.");
    }
  },

  /**
   * Fetches a single customer, scoped to businessId. Returns null rather
   * than throwing on "not found" — callers (Server Actions, detail pages)
   * decide how to handle absence, since "not found" isn't always an error
   * condition (e.g. a page might want to show a 404 UI, not a thrown error).
   */
  async getCustomer(businessId: string, customerId: string): Promise<Customer | null> {
    return prisma.customer.findFirst({
      where: { id: customerId, businessId },
      select: customerSelect,
    });
  },

  /**
   * Lists all customers for a business, most recently created first.
   * No pagination in this phase — see Phase 1 notes above.
   */
  async getCustomers(businessId: string): Promise<Customer[]> {
    return prisma.customer.findMany({
      where: { businessId },
      select: customerSelect,
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Server-side search across name, phone, and email. Empty/whitespace
   * queries fall back to the same behavior as getCustomers, so callers
   * don't need to branch on "is there a query" themselves.
   */
  async searchCustomers(businessId: string, query: string): Promise<Customer[]> {
    const trimmed = query.trim();

    if (!trimmed) {
      return this.getCustomers(businessId);
    }

    return prisma.customer.findMany({
      where: {
        businessId,
        OR: [
          { name: { contains: trimmed, mode: "insensitive" } },
          { phone: { contains: trimmed, mode: "insensitive" } },
          { email: { contains: trimmed, mode: "insensitive" } },
        ],
      },
      select: customerSelect,
      orderBy: { createdAt: "desc" },
    });
  },
};