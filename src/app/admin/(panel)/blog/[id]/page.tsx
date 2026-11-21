import { notFound } from "next/navigation";
import { PageTitle } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { PostForm } from "../post-form";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!post) notFound();
  return (
    <div>
      <PageTitle title="Edit blog post" />
      <PostForm post={post} categories={categories} />
    </div>
  );
}
