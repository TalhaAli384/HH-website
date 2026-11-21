import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: Date | null;
  readMinutes: number;
  category: { name: string } | null;
};

export function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        {post.category && (
          <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy">{post.category.name}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-3 text-xs text-muted">
          <time dateTime={post.publishedAt?.toISOString()}>{formatDate(post.publishedAt)}</time>
          <span className="h-1 w-1 rounded-full bg-muted/40" />
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readMinutes} min read
          </span>
        </div>
        <h3 className="text-lg leading-snug font-semibold transition-colors group-hover:text-gold-dark">{post.title}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy">
          Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
