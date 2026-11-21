"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fail, formToObject, revalidatePublic, type ActionState } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/upload";
import { testimonialSchema } from "@/lib/validations";

export async function saveTestimonial(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fail(parsed.error);
  const data = parsed.data;

  try {
    if (id) {
      const existing = await prisma.testimonial.findUnique({ where: { id }, select: { photoId: true } });
      if (!existing) return fail("Testimonial not found");
      await prisma.testimonial.update({ where: { id }, data });
      if (existing.photoId && existing.photoId !== data.photoId) await deleteImage(existing.photoId);
    } else {
      await prisma.testimonial.create({ data });
    }
  } catch (error) {
    console.error("[saveTestimonial]", error);
    return fail("Could not save the testimonial. Please try again.");
  }

  revalidatePublic();
  redirect("/admin/testimonials?saved=1");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  const t = await prisma.testimonial.delete({ where: { id } });
  await deleteImage(t.photoId);
  revalidatePublic();
  revalidatePath("/admin/testimonials");
}
