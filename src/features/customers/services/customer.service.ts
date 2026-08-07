import { prisma } from "@/lib/db";
import type { CustomerInput } from "../schemas/customer-schema";

export class CustomerServiceError extends Error {}

/**
 * Public-facing customer projection.
 * Deliberately omits businessId, updatedAt and relations.
 */
export interface CustomerSummary {
  id: string;
  name: string;
  email: string | null;
  phone: string ;
  address: string | null;
  createdAt: Date;
}

export const customerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  createdAt: true,
} as const;

export const customerService = {
  async createCustomer(
    businessId: string,
    input: CustomerInput
  ): Promise<CustomerSummary> {
    return prisma.customer.create({
      data: {
        businessId,
        name: input.name,
        email: input.email || null,
        phone: input.phone ,
        address: input.address || null,
      },
      select: customerSelect,
    });
  },

  async updateCustomer(
    businessId: string,
    customerId: string,
    input: CustomerInput
  ): Promise<CustomerSummary> {
    const result = await prisma.customer.updateMany({
      where: {
        id: customerId,
        businessId,
      },
      data: {
        name: input.name,
        email: input.email || null,
        phone: input.phone,
        address: input.address || null,
      },
    });

    if (result.count === 0) {
      throw new CustomerServiceError("Customer not found.");
    }

    const updated = await prisma.customer.findFirst({
      where: {
        id: customerId,
        businessId,
      },
      select: customerSelect,
    });

    if (!updated) {
      throw new CustomerServiceError("Customer not found.");
    }

    return updated;
  },

  async deleteCustomer(
    businessId: string,
    customerId: string
  ): Promise<void> {
    const result = await prisma.customer.deleteMany({
      where: {
        id: customerId,
        businessId,
      },
    });

    if (result.count === 0) {
      throw new CustomerServiceError("Customer not found.");
    }
  },

  async getCustomer(
    businessId: string,
    customerId: string
  ): Promise<CustomerSummary | null> {
    return prisma.customer.findFirst({
      where: {
        id: customerId,
        businessId,
      },
      select: customerSelect,
    });
  },

  async getCustomers(
    businessId: string
  ): Promise<CustomerSummary[]> {
    return prisma.customer.findMany({
      where: {
        businessId,
      },
      select: customerSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async searchCustomers(
    businessId: string,
    query: string
  ): Promise<CustomerSummary[]> {
    const trimmed = query.trim();

    if (!trimmed) {
      return this.getCustomers(businessId);
    }

    return prisma.customer.findMany({
      where: {
        businessId,
        OR: [
          {
            name: {
              contains: trimmed,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: trimmed,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: trimmed,
              mode: "insensitive",
            },
          },
        ],
      },
      select: customerSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};