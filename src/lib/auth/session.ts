import "server-only";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

export class UnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function requireRole(allowed: Role[]) {
  const user = await getCurrentUser();
  if (!user || !allowed.includes(user.role)) {
    throw new UnauthorizedError();
  }
  return user;
}
