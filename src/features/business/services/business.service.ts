// features/business/services/business.service.ts
import { prisma } from "@/lib/db";
import { slugify, randomSuffix } from "../utils/generate-slug";
import type { BusinessInput } from "../schemas/business-schema";

export class BusinessServiceError extends Error {}

export interface Business {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  logo: string | null;
  currency: string;
}

const businessSelect = {
  id: true,
  name: true,
  slug: true,
  phone: true,
  email: true,
  address: true,
  logo: true,
  currency: true,
} as const;

const MAX_SLUG_ATTEMPTS = 5;

export const businessService = {
  /**
   * Returns true if the given user already owns a business. Used by both
   * the onboarding page (to skip the form if already done) and
   * DashboardLayout (to gate access until onboarding is complete).
   */
  async existsForUser(userId: string): Promise<boolean> {
    const business = await prisma.business.findUnique({
      where: { ownerId: userId },
      select: { id: true },
    });
    return business !== null;
  },

  /**
   * Fetches the authenticated user's business, or null if none exists.
   * Named to match the approved method list — this is the one place
   * a page/component fetches actual business data for the current user.
   */
  async getBusinessByUser(userId: string): Promise<Business | null> {
    return prisma.business.findUnique({
      where: { ownerId: userId },
      select: businessSelect,
    });
  },

  /**
   * Generates a unique slug from a business name. Tries the clean base
   * slug first; on collision, retries with a short random suffix. Never
   * exposed to the user — exists only to satisfy the schema's required
   * unique constraint.
   */
  async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name) || "business";

    for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
      const candidate = attempt === 0 ? base : `${base}-${randomSuffix()}`;

      const existing = await prisma.business.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });

      if (!existing) return candidate;
    }

    throw new BusinessServiceError(
      "Could not generate a unique identifier. Please try again."
    );
  },

  /**
   * Creates a business for the given user. Enforces one-business-per-user
   * at the application layer (in addition to the DB's own @unique ownerId
   * constraint), so a violation surfaces as a clean ActionResult error
   * rather than an unhandled Prisma exception.
   */
  async createBusiness(userId: string, input: BusinessInput): Promise<Business> {
    const alreadyHasBusiness = await this.existsForUser(userId);

    if (alreadyHasBusiness) {
      throw new BusinessServiceError(
        "You already have a business set up on this account."
      );
    }

    const slug = await this.generateUniqueSlug(input.name);

    return prisma.business.create({
      data: {
        ownerId: userId,
        name: input.name,
        slug,
        phone: input.phone || null,
        email: input.email || null,
        address: input.address || null,
        logo: input.logo || null,
        // currency omitted — Prisma applies the schema default ("NGN")
      },
      select: businessSelect,
    });
  },
};