"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fail, formToObject, revalidatePublic, type ActionState } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/upload";
import { teamSchema } from "@/lib/validations";

export async function saveTeamMember(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = teamSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fail(parsed.error);
  const data = parsed.data;

  try {
    if (id) {
      const existing = await prisma.teamMember.findUnique({ where: { id }, select: { photoId: true } });
      if (!existing) return fail("Team member not found");
      await prisma.teamMember.update({ where: { id }, data });
      if (existing.photoId && existing.photoId !== data.photoId) await deleteImage(existing.photoId);
    } else {
      await prisma.teamMember.create({ data });
    }
  } catch (error) {
    console.error("[saveTeamMember]", error);
    return fail("Could not save the team member. Please try again.");
  }

  revalidatePublic("/team", "/about");
  redirect("/admin/team?saved=1");
}

export async function deleteTeamMember(id: string) {
  await requireAdmin();
  const member = await prisma.teamMember.delete({ where: { id } });
  await deleteImage(member.photoId);
  revalidatePublic("/team", "/about");
  revalidatePath("/admin/team");
}
