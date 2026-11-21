import "server-only";
import { prisma } from "@/lib/prisma";

/** Finds or creates the customer record for an inquiry and keeps their details current. */
export async function upsertCustomer(data: { name: string; email: string; phone?: string | null }) {
  const email = data.email.toLowerCase();
  return prisma.user.upsert({
    where: { email },
    update: { name: data.name, ...(data.phone ? { phone: data.phone } : {}) },
    create: { name: data.name, email, phone: data.phone || null },
    select: { id: true },
  });
}
