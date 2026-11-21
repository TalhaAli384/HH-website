import { Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteBlogCategory, deleteBlogPost } from "@/actions/blog";
import { DeleteButton } from "@/components/admin/delete-button";
import { FormCard } from "@/components/admin/fields";
import { EmptyState, Flash, PageTitle, Pill, TableWrap } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { CategoryForm } from "./category-form";

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { posts: true } } } }),
  ]);

  return (
    <div>
      <PageTitle title="Blog Posts" description="Write and publish news, tips and project updates." action={{ href: "/admin/blog/new", label: "New post" }} />
      <Flash show={saved === "1"} message="Post saved successfully." />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div>
          {posts.length ? (
            <TableWrap>
              <thead>
                <tr><th>Post</th><th>Category</th><th>Status</th><th>Date</th><th className="text-right">Actions</th></tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-mist">
                          <Image src={p.coverImage} alt="" fill sizes="64px" className="object-cover" />
                        </div>
                        <Link href={`/admin/blog/${p.id}`} className="line-clamp-2 max-w-xs font-semibold text-navy hover:text-gold-dark">{p.title}</Link>
                      </div>
                    </td>
                    <td className="text-muted">{p.category?.name ?? "—"}</td>
                    <td>{p.published ? <Pill tone="green">Published</Pill> : <Pill>Draft</Pill>}</td>
                    <td className="whitespace-nowrap text-muted">{formatDate(p.publishedAt ?? p.createdAt)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/blog/${p.id}`} className="rounded-lg p-2 text-navy hover:bg-mist" aria-label={`Edit ${p.title}`}><Pencil className="h-4 w-4" /></Link>
                        <DeleteButton compact action={deleteBlogPost.bind(null, p.id)} label={`Delete ${p.title}`} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          ) : (
            <EmptyState message="No posts yet." action={{ href: "/admin/blog/new", label: "Write your first post" }} />
          )}
        </div>
        <FormCard title="Categories" className="self-start">
          <ul className="divide-y divide-line">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm font-medium">{c.name} <span className="text-muted">({c._count.posts})</span></span>
                <DeleteButton compact confirmText="Delete?" action={deleteBlogCategory.bind(null, c.id)} label={`Delete category ${c.name}`} />
              </li>
            ))}
            {!categories.length && <li className="py-2 text-sm text-muted">No categories yet.</li>}
          </ul>
          <CategoryForm />
        </FormCard>
      </div>
    </div>
  );
}
