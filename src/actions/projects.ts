"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { fail, formToObject, isUniqueViolation, revalidatePublic, uniqueSlug, type ActionState } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/upload";
import { slugify } from "@/lib/utils";
import { maxProjectGalleryImages } from "@/config/site";
import { projectSchema } from "@/lib/validations";

export async function saveProject(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fail(parsed.error);

  let galleryImages: { url: string; publicId: string | null; caption: string }[] = [];
  if (!id) {
    let rawGallery: unknown;
    try {
      rawGallery = JSON.parse(String(formData.get("galleryImages") ?? "[]"));
    } catch {
      return fail("Project gallery data is invalid. Please try uploading the images again.");
    }
    const galleryParsed = z.array(z.object({
      url: z.string().trim().min(1).max(500),
      publicId: z.string().max(300),
      caption: z.string().max(200),
    })).max(maxProjectGalleryImages).safeParse(rawGallery);
    if (!galleryParsed.success) return fail("Project gallery data is invalid. Please remove some images and try again.");
    galleryImages = galleryParsed.data.map((image) => ({ ...image, publicId: image.publicId || null }));
  }

  const { slug: rawSlug, ...data } = parsed.data;
  const slug = await uniqueSlug(slugify(rawSlug || data.title), (s) => prisma.project.findUnique({ where: { slug: s }, select: { id: true } }), id);

  let savedId = id;
  try {
    if (id) {
      const existing = await prisma.project.findUnique({ where: { id }, select: { coverImageId: true, slug: true } });
      if (!existing) return fail("Project not found");
      await prisma.project.update({ where: { id }, data: { ...data, slug } });
      if (existing.coverImageId && existing.coverImageId !== data.coverImageId) await deleteImage(existing.coverImageId);
      revalidatePath(`/projects/${existing.slug}`);
    } else {
      savedId = await prisma.$transaction(async (transaction) => {
        const project = await transaction.project.create({ data: { ...data, slug }, select: { id: true } });
        if (galleryImages.length) {
          await transaction.projectImage.createMany({
            data: galleryImages.map((image, sortOrder) => ({ ...image, projectId: project.id, sortOrder })),
          });
        }
        return project.id;
      });
    }
  } catch (error) {
    if (isUniqueViolation(error)) return fail("A project with this slug already exists.");
    console.error("[saveProject]", error);
    return fail("Could not save the project. Please try again.");
  }

  revalidatePublic("/projects", `/projects/${slug}`);
  // New projects go to the edit screen so the gallery can be added straight away.
  redirect(id ? "/admin/projects?saved=1" : `/admin/projects/${savedId}?created=1`);
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const project = await prisma.project.findUnique({ where: { id }, include: { images: true } });
  if (!project) return;
  await prisma.project.delete({ where: { id } });
  await Promise.all([deleteImage(project.coverImageId), ...project.images.map((img) => deleteImage(img.publicId))]);
  revalidatePublic("/projects", `/projects/${project.slug}`);
  revalidatePath("/admin/projects");
}

const imageInput = z.object({ url: z.string().min(1).max(500), publicId: z.string().max(300).nullable() });

export async function addProjectImages(projectId: string, images: { url: string; publicId: string | null }[]) {
  await requireAdmin();
  const valid = z.array(imageInput).max(30).parse(images);
  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { slug: true, _count: { select: { images: true } } } });
  if (!project) throw new Error("Project not found");
  await prisma.projectImage.createMany({
    data: valid.map((img, i) => ({ ...img, projectId, sortOrder: project._count.images + i })),
  });
  revalidatePath(`/projects/${project.slug}`);
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function updateProjectImage(imageId: string, caption: string) {
  await requireAdmin();
  const img = await prisma.projectImage.update({
    where: { id: imageId },
    data: { caption: caption.trim().slice(0, 200) || null },
    include: { project: { select: { slug: true } } },
  });
  revalidatePath(`/projects/${img.project.slug}`);
}

export async function moveProjectImage(imageId: string, direction: -1 | 1) {
  await requireAdmin();
  const img = await prisma.projectImage.findUnique({ where: { id: imageId }, include: { project: { select: { slug: true } } } });
  if (!img) return;
  const siblings = await prisma.projectImage.findMany({ where: { projectId: img.projectId }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  const index = siblings.findIndex((s) => s.id === imageId);
  const target = index + direction;
  if (target < 0 || target >= siblings.length) return;
  [siblings[index], siblings[target]] = [siblings[target], siblings[index]];
  await prisma.$transaction(siblings.map((s, i) => prisma.projectImage.update({ where: { id: s.id }, data: { sortOrder: i } })));
  revalidatePath(`/projects/${img.project.slug}`);
  revalidatePath(`/admin/projects/${img.projectId}`);
}

export async function deleteProjectImage(imageId: string) {
  await requireAdmin();
  const img = await prisma.projectImage.delete({ where: { id: imageId }, include: { project: { select: { slug: true } } } });
  await deleteImage(img.publicId);
  revalidatePath(`/projects/${img.project.slug}`);
  revalidatePath(`/admin/projects/${img.projectId}`);
}
