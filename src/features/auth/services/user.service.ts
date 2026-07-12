// features/auth/services/user.service.ts
import { prisma } from "@/lib/db";
import type { RegisterInput } from "../schemas/register-schema";

/**
 * Public-safe user shape. Deliberately excludes passwordHash so it can
 * never accidentally leak into a client-bound response — any code that
 * needs the hash must go through this service's internal Prisma calls,
 * never receive it back out.
 */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
} as const;

export const userService = {
  async findByEmail(email: string) {
    // Returns the full record, including passwordHash — this is the one
    // internal method allowed to see it, used only by auth.service.ts
    // for credential verification. Never return this result directly
    // from a Server Action.
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async existsByEmail(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return user !== null;
  },

  async create(
    input: Pick<RegisterInput, "name" | "email" | "phoneNumber">,
    passwordHash: string
  ): Promise<PublicUser> {
    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        phoneNumber: input.phoneNumber,
        passwordHash,
      },
      select: publicUserSelect,
    });
  },

  async findPublicById(id: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  },
};