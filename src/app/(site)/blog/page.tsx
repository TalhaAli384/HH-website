import type { Metadata } from "next";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { BlogCard } from "@/components/site/blog-card";
import { PageHeader } from "@/components/site/page-header";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog & News",
  description: "Construction industry updates, company announcements, building tips and project news from HH Constructions and Developers.",
  alternates: { canonical: "/blog" },
};

const PAGE_SIZE = 9;

type Props = { searchParams: Promise<{ category?: string; page?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const categorySlug = params.category;

  const where = { published: true, ...(categorySlug ? { category: { slug: categorySlug } } : {}) };
  const [posts, total, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: { select: { name: true } } },
    }),
    prisma.blogPost.count({ where }),
    prisma.blogCategory.findMany({ where: { posts: { some: { published: true } } }, orderBy: { name: "asc" } }),
  ]);
  const pages = Math.ceil(total / PAGE_SIZE);
  const href = (p: number, c = categorySlug) => {
    const q = new URLSearchParams();
    if (c) q.set("category", c);
    if (p > 1) q.set("page", String(p));
    const s = q.toString();
    return `/blog${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        eyebrow="Blog & News"
        title="Insights from the construction site"
        description="Industry updates, expert building advice and the latest news from our projects."
        image="https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=2000&q=75"
        crumbs={[{ label: "Blog" }]}
      />
      <section className="section">
        <div className="container-x">
          {categories.length > 0 && (
            <nav aria-label="Blog categories" className="mb-12 flex flex-wrap justify-center gap-2">
              {[{ slug: undefined, name: "All Posts" }, ...categories].map((c) => {
                const active = c.slug === categorySlug;
                return (
                  <Link
                    key={c.name}
                    href={href(1, c.slug)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-full border px-5 py-2 text-sm font-medium transition",
                      active ? "border-navy bg-navy text-white" : "border-line text-ink/70 hover:border-navy/30 hover:text-navy",
                    )}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {posts.length ? (
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <StaggerItem key={post.id} className="relative">
                  <BlogCard post={post} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="rounded-2xl bg-mist py-16 text-center text-muted">No articles published yet. Please check back soon.</p>
          )}

          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-14 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={href(p)}
                  aria-current={p === page ? "page" : undefined}
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-full font-numeric font-bold transition",
                    p === page ? "bg-navy text-white" : "bg-mist text-navy hover:bg-gold",
                  )}
                >
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
