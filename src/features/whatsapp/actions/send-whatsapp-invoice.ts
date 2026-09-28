// src/features/whatsapp/actions/send-whatsapp-invoice.ts

import {
  whatsappService,
  type SendWhatsAppMessageResult,
} from "../services/whatsapp.service";

export interface SendWhatsAppInvoiceInput {
  recipientPhone: string;
  customerName: string;
  orderNumber: string;
  estimatedDelivery: string;
}

export async function sendWhatsAppInvoice(
  input: SendWhatsAppInvoiceInput
): Promise<SendWhatsAppMessageResult> {
  if (!input.recipientPhone.trim()) {
    throw new Error("Customer phone number is required.");
  }

  if (!input.customerName.trim()) {
    throw new Error("Customer name is required.");
  }

  if (!input.orderNumber.trim()) {
    throw new Error("Order number is required.");
  }

  if (!input.estimatedDelivery.trim()) {
    throw new Error("Estimated delivery is required.");
  }

  return whatsappService.sendTemplateMessage({
    recipientPhone: input.recipientPhone,
    templateName: "jaspers_market_order_confirmation_v1",
    languageCode: "en_US",
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: input.customerName.trim(),
          },
          {
            type: "text",
            text: input.orderNumber.trim(),
          },
          {
            type: "text",
            text: input.estimatedDelivery.trim(),
          },
        ],
      },
    ],
  });
}
