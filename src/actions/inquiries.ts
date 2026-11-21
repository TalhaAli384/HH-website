"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fail, formToObject, type ActionState } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inquiryUpdateSchema } from "@/lib/validations";

export async function updateQuote(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = inquiryUpdateSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fail(parsed.error);
  const { id, ...data } = parsed.data;
  await prisma.quoteRequest.update({ where: { id }, data });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Quote request updated." };
}

export async function updateMessage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = inquiryUpdateSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fail(parsed.error);
  const { id, ...data } = parsed.data;
  await prisma.contactMessage.update({ where: { id }, data });
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Message updated." };
}

export async function deleteQuote(id: string) {
  await requireAdmin();
  await prisma.quoteRequest.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  redirect("/admin/quotes?deleted=1");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin", "layout");
  redirect("/admin/messages?deleted=1");
}
