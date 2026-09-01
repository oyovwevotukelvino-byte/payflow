// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { authConfig } from "./auth.config";
import { authService } from "@/features/auth/services/auth.service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        // No parsing here — authService.validateCredentials owns it now.
        return authService.validateCredentials(credentials);
      },
    }),
  ],
  callbacks: {
  ...authConfig.callbacks,
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.sub!;

      if (token.phoneNumber) {
        session.user.phoneNumber = token.phoneNumber as string;
      }
    }

    return session;
  },

  async jwt({ token, user }) {
    if (user) {
      token.phoneNumber = user.phoneNumber;
    }

    return token;
  },
},
});