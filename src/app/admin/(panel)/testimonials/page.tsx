import { Pencil, Star } from "lucide-react";
import Link from "next/link";
import { deleteTestimonial } from "@/actions/testimonials";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState, Flash, PageTitle, Pill } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export default async function AdminTestimonialsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const items = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageTitle title="Testimonials" description="Featured, published testimonials rotate on the home page." action={{ href: "/admin/testimonials/new", label: "New testimonial" }} />
      <Flash show={saved === "1"} message="Testimonial saved successfully." />
      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((t) => (
            <article key={t.id} className="flex flex-col rounded-2xl border border-line bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-navy">{t.name}</p>
                  <p className="text-sm text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</p>
                </div>
                <div className="flex gap-0.5" aria-label={`${t.rating} stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={i < t.rating ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4 text-line"} />
                  ))}
                </div>
              </div>
              <p className="mt-4 line-clamp-4 flex-1 text-sm leading-relaxed text-ink/80">“{t.content}”</p>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <div className="flex gap-2">
                  {t.published ? <Pill tone="green">Published</Pill> : <Pill>Hidden</Pill>}
                  {t.featured && <Pill tone="gold">Featured</Pill>}
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/admin/testimonials/${t.id}`} className="rounded-lg p-2 text-navy hover:bg-mist" aria-label={`Edit testimonial from ${t.name}`}><Pencil className="h-4 w-4" /></Link>
                  <DeleteButton compact action={deleteTestimonial.bind(null, t.id)} label={`Delete testimonial from ${t.name}`} />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState message="No testimonials yet." action={{ href: "/admin/testimonials/new", label: "Add a testimonial" }} />
      )}
    </div>
  );
}
