import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),

  AUTH_SECRET: z.string().min(32),

  AUTH_URL: z.string().url(),

  PAYSTACK_SECRET_KEY: z.string().min(1),

  PAYSTACK_PUBLIC_KEY: z.string().optional(),

  WHATSAPP_ACCESS_TOKEN: z.string().optional(),

  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),

  WHATSAPP_VERIFY_TOKEN: z.string().optional(),

  WHATSAPP_GRAPH_API_VERSION: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),

  CLOUDINARY_API_KEY: z.string().optional(),

  CLOUDINARY_API_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
