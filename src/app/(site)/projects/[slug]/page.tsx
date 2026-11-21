import { ArrowLeft, ArrowRight, Building, Calendar, Layers, MapPin, Ruler, User, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Gallery } from "@/components/site/gallery";
import { PageHeader } from "@/components/site/page-header";
import { ProjectCard } from "@/components/site/project-card";
import { ButtonLink } from "@/components/ui/button";
import { projectCategoryLabels, projectStatusLabels } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { formatDate, paragraphs } from "@/lib/utils";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

const getProject = cache((slug: string) =>
  prisma.project.findFirst({
    where: { slug, published: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  }),
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, images: [project.coverImage], type: "article" },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProject((await params).slug);
  if (!project) notFound();

  const related = await prisma.project.findMany({
    where: { published: true, id: { not: project.id }, category: project.category },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const specs = (Array.isArray(project.specifications) ? project.specifications : []) as { label: string; value: string }[];
  const facts = [
    { icon: MapPin, label: "Location", value: project.location },
    { icon: Building, label: "Category", value: projectCategoryLabels[project.category] },
    { icon: Layers, label: "Status", value: projectStatusLabels[project.status] },
    project.client && { icon: User, label: "Client", value: project.client },
    project.area && { icon: Ruler, label: "Covered Area", value: project.area },
    project.floors != null && { icon: Layers, label: "Floors", value: String(project.floors) },
    project.budget && { icon: Wallet, label: "Project Value", value: project.budget },
    project.startDate && { icon: Calendar, label: "Started", value: formatDate(project.startDate, { month: "long", year: "numeric" }) },
    project.completionDate && {
      icon: Calendar,
      label: project.status === "COMPLETED" ? "Completed" : "Expected Completion",
      value: formatDate(project.completionDate, { month: "long", year: "numeric" }),
    },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  const gallery = [{ id: "cover", url: project.coverImage, caption: project.title }, ...project.images];

  return (
    <>
      <PageHeader
        eyebrow={`${projectCategoryLabels[project.category]} · ${projectStatusLabels[project.status]}`}
        title={project.title}
        description={project.summary}
        image={project.coverImage}
        crumbs={[{ label: "Projects", href: "/projects" }, { label: project.title }]}
      />

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Project overview</h2>
              <div className="prose-hh mt-6 text-lg">
                {paragraphs(project.description).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Project gallery</h2>
              <Gallery images={gallery} title={project.title} />
            </Reveal>

            {specs.length > 0 && (
              <Reveal className="mt-14">
                <h2 className="mb-6 text-2xl font-bold sm:text-3xl">Specifications</h2>
                <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
                  {specs.map((s) => (
                    <div key={s.label} className="grid gap-1 px-6 py-4 even:bg-mist/60 sm:grid-cols-[220px_1fr] sm:gap-6">
                      <dt className="font-semibold text-navy">{s.label}</dt>
                      <dd className="text-muted">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Reveal className="rounded-2xl bg-navy p-8 text-white">
              <h2 className="mb-6 text-xl font-semibold text-white">Project details</h2>
              <dl className="space-y-5">
                {facts.map((f) => (
                  <div key={f.label} className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/10 text-gold">
                      <f.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <dt className="text-xs tracking-wider text-white/50 uppercase">{f.label}</dt>
                      <dd className="mt-0.5 font-medium">{f.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={0.1} className="rounded-2xl border border-gold/40 bg-gold/5 p-8">
              <h2 className="text-xl font-semibold">Planning a similar project?</h2>
              <p className="mt-3 text-muted">Get a free consultation and a detailed estimate from our team.</p>
              <ButtonLink href="/quote" className="mt-6 w-full">
                Request a Quote <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </Reveal>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-mist">
          <div className="container-x">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="text-3xl font-bold">Related projects</h2>
              <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark">
                <ArrowLeft className="h-4 w-4" /> All projects
              </Link>
            </div>
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <StaggerItem key={p.id}>
                  <ProjectCard project={p} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </>
  );
}
