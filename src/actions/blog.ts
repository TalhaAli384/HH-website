"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fail, formToObject, isUniqueViolation, revalidatePublic, uniqueSlug, type ActionState } from "@/lib/action-utils";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/upload";
import { slugify } from "@/lib/utils";
import { blogCategorySchema, blogPostSchema } from "@/lib/validations";

export async function saveBlogPost(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = blogPostSchema.safeParse(formToObject(formData));
  if (!parsed.success) return fail(parsed.error);

  const { slug: rawSlug, ...data } = parsed.data;
  const slug = await uniqueSlug(slugify(rawSlug || data.title), (s) => prisma.blogPost.findUnique({ where: { slug: s }, select: { id: true } }), id);

  try {
    if (id) {
      const existing = await prisma.blogPost.findUnique({ where: { id }, select: { coverImageId: true, publishedAt: true, slug: true } });
      if (!existing) return fail("Post not found");
      await prisma.blogPost.update({
        where: { id },
        data: { ...data, slug, publishedAt: data.published ? (existing.publishedAt ?? new Date()) : existing.publishedAt },
      });
      if (existing.coverImageId && existing.coverImageId !== data.coverImageId) await deleteImage(existing.coverImageId);
      revalidatePath(`/blog/${existing.slug}`);
    } else {
      await prisma.blogPost.create({
        data: { ...data, slug, authorId: admin.id, publishedAt: data.published ? new Date() : null },
      });
    }
  } catch (error) {
    if (isUniqueViolation(error)) return fail("A post with this slug already exists.");
    console.error("[saveBlogPost]", error);
    return fail("Could not save the post. Please try again.");
  }

  revalidatePublic("/blog", `/blog/${slug}`);
  redirect("/admin/blog?saved=1");
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  const post = await prisma.blogPost.delete({ where: { id } });
  await deleteImage(post.coverImageId);
  revalidatePublic("/blog", `/blog/${post.slug}`);
  revalidatePath("/admin/blog");
}

export async function createBlogCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = blogCategorySchema.safeParse(formToObject(formData));
  if (!parsed.success) return fail(parsed.error);
  try {
    await prisma.blogCategory.create({ data: { ...parsed.data, slug: slugify(parsed.data.name) } });
  } catch (error) {
    if (isUniqueViolation(error)) return fail("A category with this name already exists.");
    return fail("Could not create the category.");
  }
  revalidatePath("/admin/blog");
  revalidatePublic("/blog");
  return { ok: true, message: `Category "${parsed.data.name}" created.` };
}

export async function deleteBlogCategory(id: string) {
  await requireAdmin();
  await prisma.blogCategory.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePublic("/blog");
}
