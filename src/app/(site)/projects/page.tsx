import type { Metadata } from "next";
import { CtaSection } from "@/components/site/cta-section";
import { PageHeader } from "@/components/site/page-header";
import { ProjectGrid } from "@/components/site/project-grid";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects & Portfolio",
  description: "Explore completed, ongoing and upcoming residential, commercial and development projects by HH Constructions and Developers.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const [projects, home, company] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      select: { id: true, slug: true, title: true, summary: true, location: true, coverImage: true, category: true, status: true },
    }),
    getSetting("home"),
    getSetting("company"),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Our Portfolio"
        title="Projects that define skylines"
        description="Browse our completed landmarks, the developments currently under construction and the exciting projects coming soon."
        image="https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=2000&q=75"
        crumbs={[{ label: "Projects" }]}
      />
      <section className="section">
        <div className="container-x">
          <ProjectGrid projects={projects} />
        </div>
      </section>
      <CtaSection title={home.ctaTitle} text={home.ctaText} phone={company.phone} />
    </>
  );
}
