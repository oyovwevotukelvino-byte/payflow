import type { NextAuthConfig } from "next-auth";

 export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        return isLoggedIn;
      }

      return true;
    },
  },

  providers: [],
};