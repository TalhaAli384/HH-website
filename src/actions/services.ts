"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fail, formToObject, revalidatePublic, uniqueSlug, type ActionState } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/upload";
import { slugify } from "@/lib/utils";
import { serviceSchema } from "@/lib/validations";

export async function saveService(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fail(parsed.error);

  const { slug: rawSlug, ...data } = parsed.data;
  const slug = await uniqueSlug(slugify(rawSlug || data.title), (s) => prisma.service.findUnique({ where: { slug: s }, select: { id: true } }), id);

  try {
    if (id) {
      const existing = await prisma.service.findUnique({ where: { id }, select: { imageId: true } });
      if (!existing) return fail("Service not found");
      await prisma.service.update({ where: { id }, data: { ...data, slug } });
      if (existing.imageId && existing.imageId !== data.imageId) await deleteImage(existing.imageId);
    } else {
      await prisma.service.create({ data: { ...data, slug } });
    }
  } catch (error) {
    console.error("[saveService]", error);
    return fail("Could not save the service. Please try again.");
  }

  revalidatePublic("/services");
  redirect("/admin/services?saved=1");
}

export async function deleteService(id: string) {
  await requireAdmin();
  const service = await prisma.service.delete({ where: { id } });
  await deleteImage(service.imageId);
  revalidatePublic("/services");
  revalidatePath("/admin/services");
}
