import { PageTitle } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { PostForm } from "../post-form";

export default async function NewPostPage() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
  return (
    <div>
      <PageTitle title="New blog post" />
      <PostForm categories={categories} />
    </div>
  );
}
