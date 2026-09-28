// src/features/whatsapp/services/whatsapp.service.ts

import { env } from "@/lib/env";

export class WhatsAppServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WhatsAppServiceError";
  }
}

interface WhatsAppTemplateComponent {
  type: "header" | "body" | "button";
  parameters?: Array<{
    type: "text";
    text: string;
  }>;
  sub_type?: "quick_reply" | "url";
  index?: string;
}

export interface SendWhatsAppTemplateInput {
  recipientPhone: string;
  templateName: string;
  languageCode: string;
  components?: WhatsAppTemplateComponent[];
}

export interface SendWhatsAppMessageResult {
  messageId: string;
}

interface WhatsAppApiResponse {
  messaging_product?: string;
  contacts?: Array<{
    input: string;
    wa_id: string;
  }>;
  messages?: Array<{
    id: string;
  }>;
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_data?: {
      messaging_product?: string;
      details?: string;
    };
    fbtrace_id?: string;
  };
}

function normalizePhoneNumber(phone: string): string {
  const normalized = phone.trim().replace(/[^\d]/g, "");

  if (!normalized) {
    throw new WhatsAppServiceError("Recipient phone number is required.");
  }

  if (!/^\d{10,15}$/.test(normalized)) {
    throw new WhatsAppServiceError(
      "Recipient phone number must be a valid international phone number."
    );
  }

  return normalized;
}

function validateConfiguration(): {
  accessToken: string;
  phoneNumberId: string;
  graphApiVersion: string;
} {
  const accessToken = env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
  const graphApiVersion = env.WHATSAPP_GRAPH_API_VERSION;
  if (!accessToken) {
    throw new WhatsAppServiceError("WhatsApp access token is not configured.");
  }

  if (!phoneNumberId) {
    throw new WhatsAppServiceError(
      "WhatsApp phone number ID is not configured."
    );
  }

  if (!graphApiVersion) {
    throw new WhatsAppServiceError(
      "WhatsApp Graph API version is not configured."
    );
  }

  return {
    accessToken,
    phoneNumberId,
    graphApiVersion,
  };
}

export const whatsappService = {
  async sendTemplateMessage(
    input: SendWhatsAppTemplateInput
  ): Promise<SendWhatsAppMessageResult> {
    const { accessToken, phoneNumberId, graphApiVersion } =
      validateConfiguration();

    const recipientPhone = normalizePhoneNumber(input.recipientPhone);

    const templateName = input.templateName.trim();
    const languageCode = input.languageCode.trim();

    if (!templateName) {
      throw new WhatsAppServiceError("WhatsApp template name is required.");
    }

    if (!languageCode) {
      throw new WhatsAppServiceError(
        "WhatsApp template language code is required."
      );
    }

    const url = `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: recipientPhone,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        ...(input.components?.length
          ? {
              components: input.components,
            }
          : {}),
      },
    };

    let response: Response;

    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("WhatsApp Cloud API connection failed:", error);

      throw new WhatsAppServiceError(
        "Unable to connect to the WhatsApp Cloud API."
      );
    }

    let data: WhatsAppApiResponse;

    try {
      data = (await response.json()) as WhatsAppApiResponse;
    } catch {
      throw new WhatsAppServiceError(
        "WhatsApp Cloud API returned an invalid response."
      );
    }

    if (!response.ok || data.error) {
      const apiMessage =
        data.error?.error_data?.details ??
        data.error?.message ??
        "WhatsApp message could not be sent.";

      throw new WhatsAppServiceError(apiMessage);
    }

    const messageId = data.messages?.[0]?.id;

    if (!messageId) {
      throw new WhatsAppServiceError(
        "WhatsApp API did not return a message ID."
      );
    }

    return {
      messageId,
    };
  },
};
