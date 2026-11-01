import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

const ROLE_HOME: Record<Role, string> = {
  ADMIN: "/admin",
  RESIDENT: "/residente",
  GUARD: "/guardia",
};

const ROLE_PREFIX: Record<Role, string> = {
  ADMIN: "/admin",
  RESIDENT: "/residente",
  GUARD: "/guardia",
};

export { ROLE_HOME };

export const authConfig: NextAuthConfig = {
  // Self-hosted deployments (no fixed Vercel domain) must opt in to trusting
  // the incoming Host header; without this, Auth.js rejects every request
  // in production with an UntrustedHost error.
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const role = auth?.user?.role as Role | undefined;

      const protectedEntry = (Object.entries(ROLE_PREFIX) as [Role, string][]).find(
        ([, prefix]) => pathname.startsWith(prefix)
      );

      if (!protectedEntry) {
        return true;
      }

      if (!role) {
        return false;
      }

      const [requiredRole] = protectedEntry;
      if (role !== requiredRole) {
        return Response.redirect(new URL("/unauthorized", request.nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: Role }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
};
