import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Reveal } from "@/components/motion/reveal";
import { BlogCard } from "@/components/site/blog-card";
import { PageHeader } from "@/components/site/page-header";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { renderContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { absoluteUrl, formatDate } from "@/lib/utils";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

const getPost = cache((slug: string) =>
  prisma.blogPost.findFirst({
    where: { slug, published: true },
    include: { category: true, author: { select: { name: true } } },
  }),
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const related = await prisma.blogPost.findMany({
    where: { published: true, id: { not: post.id }, ...(post.categoryId ? { categoryId: post.categoryId } : {}) },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { category: { select: { name: true } } },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name, logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") } },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <>
      <PageHeader
        eyebrow={post.category?.name ?? "News"}
        title={post.title}
        image={post.coverImage}
        crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
      />
      <article className="section">
        <div className="container-x max-w-3xl">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-line pb-6 text-sm text-muted">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gold" /> {formatDate(post.publishedAt, { day: "numeric", month: "long", year: "numeric" })}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /> {post.readMinutes} min read</span>
              <span className="flex items-center gap-2"><User className="h-4 w-4 text-gold" /> {post.author?.name ?? "HH Constructions"}</span>
            </div>
            <p className="mb-8 text-xl leading-relaxed font-medium text-navy">{post.excerpt}</p>
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
            </div>
            <div className="prose-hh text-[17px]">{renderContent(post.content)}</div>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl bg-mist p-8 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-lg font-semibold text-navy">Have a project in mind?</p>
                <p className="mt-1 text-muted">Talk to our experts for a free consultation.</p>
              </div>
              <ButtonLink href="/quote">Get a Quote</ButtonLink>
            </div>
            <Link href="/blog" className="mt-10 inline-flex items-center gap-2 font-semibold text-navy hover:text-gold-dark">
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </Link>
          </Reveal>
        </div>
      </article>
      {related.length > 0 && (
        <section className="section bg-mist">
          <div className="container-x">
            <h2 className="mb-10 text-3xl font-bold">More articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <BlogCard key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
