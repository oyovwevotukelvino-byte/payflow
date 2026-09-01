// features/invoices/services/invoice.service.ts
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import {
  calculateInvoiceTotals,
  InvoiceCalculationError,
} from "../utils/invoice-calculations";
import { formatInvoiceNumber } from "../constants/invoice.constants";
import { resolveTax } from "../utils/invoice-tax";
import type { CreateInvoiceInput } from "../schemas/invoice-schema";


export class InvoiceServiceError extends Error {}

function generatePublicToken(): string {
  return randomBytes(32).toString("hex");
}

export interface InvoiceItemSummary {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  total: string;
}

export interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  status: string;
  subtotal: string;
  vatEnabled: boolean;
  tax: string;
  total: string;
  notes: string | null;
  dueDate: Date;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerAddress: string | null;
  createdAt: Date;
  items: InvoiceItemSummary[];
}

const invoiceItemSelect = {
  id: true,
  description: true,
  quantity: true,
  unitPrice: true,
  total: true,
} as const;

const invoiceSelect = {
  id: true,
  invoiceNumber: true,
  status: true,
  subtotal: true,
  vatEnabled: true,
  tax: true,
  total: true,
  notes: true,
  dueDate: true,
  customerName: true,
  customerPhone: true,
  customerEmail: true,
  customerAddress: true,
  createdAt: true,
  items: { select: invoiceItemSelect },
} as const;



function mapInvoiceToSummary(invoice: {
  id: string;
  invoiceNumber: string;
  status: string;
  subtotal: { toString(): string };
  vatEnabled: boolean;
  tax: { toString(): string };
  total: { toString(): string };
  notes: string | null;
  dueDate: Date;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerAddress: string | null;
  createdAt: Date;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: { toString(): string };
    total: { toString(): string };
  }>;
}): InvoiceSummary {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    subtotal: invoice.subtotal.toString(),
    vatEnabled: invoice.vatEnabled,
    tax: invoice.tax.toString(),
    total: invoice.total.toString(),
    notes: invoice.notes,
    dueDate: invoice.dueDate,
    customerName: invoice.customerName,
    customerPhone: invoice.customerPhone,
    customerEmail: invoice.customerEmail,
    customerAddress: invoice.customerAddress,
    createdAt: invoice.createdAt,
    items: invoice.items.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toString(),
      total: item.total.toString(),
    })),
  };
}

export const invoiceService = {
  async createInvoice(
    businessId: string,
    input: CreateInvoiceInput
  ): Promise<InvoiceSummary> {
    if (input.items.length === 0) {
      throw new InvoiceServiceError("An invoice needs at least one item.");
    }

    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findFirst({
        where: {
          id: input.customerId,
          businessId,
        },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          address: true,
        },
      });

      if (!customer) {
        throw new InvoiceServiceError(
          "This customer doesn't belong to your business, or doesn't exist."
        );
      }

      let totals;

      try {
        const lineItems = input.items.map((item) => ({
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        }));

        const preTax = calculateInvoiceTotals(lineItems, 0);

        const taxAmount = resolveTax(
          preTax.subtotal,
          input.vatEnabled
        );

        totals = calculateInvoiceTotals(
          lineItems,
          taxAmount
        );
      } catch (err) {
        if (err instanceof InvoiceCalculationError) {
          throw new InvoiceServiceError(err.message);
        }

        throw err;
      }

      const business = await tx.business.update({
        where: {
          id: businessId,
        },
        data: {
          nextInvoiceNumber: {
            increment: 1,
          },
        },
        select: {
          nextInvoiceNumber: true,
        },
      });

      const reservedNumber = business.nextInvoiceNumber - 1;

      const invoiceNumber = formatInvoiceNumber(
        reservedNumber
      );

      const invoice = await tx.invoice.create({
        data: {
          businessId,
          customerId: customer.id,
          publicToken: generatePublicToken(),
          invoiceNumber,
          status: "DRAFT",

          subtotal: totals.subtotal,
          vatEnabled: input.vatEnabled,
          tax: totals.tax,
          total: totals.total,

          notes: input.notes?.trim() || null,
          dueDate: input.dueDate,

          customerName: customer.name,
          customerPhone: customer.phone,
          customerEmail: customer.email,
          customerAddress: customer.address,

          items: {
            create: totals.items.map((item, index) => ({
              description: input.items[index].description.trim(),
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              total: item.lineTotal,
            })),
          },
        },
        select: invoiceSelect,
      });

      return mapInvoiceToSummary(invoice);
    });
  },

  async getInvoiceById(
    businessId: string,
    invoiceId: string
  ): Promise<InvoiceSummary | null> {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        businessId,
      },
      select: invoiceSelect,
    });

    return invoice ? mapInvoiceToSummary(invoice) : null;
  },

  async getInvoices(
    businessId: string
  ): Promise<InvoiceSummary[]> {
    const invoices = await prisma.invoice.findMany({
      where: {
        businessId,
      },
      select: invoiceSelect,
      orderBy: {
        createdAt: "desc",
      },
    });

    return invoices.map(mapInvoiceToSummary);
  },
  async getInvoiceByPublicToken(
    publicToken: string
  ): Promise<InvoiceSummary | null> {
    const invoice = await prisma.invoice.findUnique({
      where: {
        publicToken,
      },
      select: invoiceSelect,
    });

    return invoice ? mapInvoiceToSummary(invoice) : null;
  },
};
