import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    phoneNumber: string | null;
  }

  interface Session {
    user: {
      id: string;
      phoneNumber: string | null;
    } & DefaultSession["user"];
  }
}