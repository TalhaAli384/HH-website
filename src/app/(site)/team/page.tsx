import type { Metadata } from "next";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { CtaSection } from "@/components/site/cta-section";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { TeamCard } from "@/components/site/team-card";
import { departmentLabels } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { cn } from "@/lib/utils";
import type { TeamDepartment } from "@/generated/prisma/enums";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the management, architects, civil engineers, project managers and technical professionals of HH Constructions and Developers.",
  alternates: { canonical: "/team" },
};

const intros: Record<TeamDepartment, string> = {
  MANAGEMENT: "Experienced leaders who set our standards and stand behind every project.",
  ARCHITECTURE: "Creative minds who shape functional, beautiful and buildable spaces.",
  ENGINEERING: "Structural and civil engineers ensuring safety, strength and compliance.",
  PROJECT_MANAGEMENT: "The people who keep schedules, budgets and quality on track.",
  TECHNICAL: "Specialists in MEP, surveying, estimation and site supervision.",
};

export default async function TeamPage() {
  const [members, company] = await Promise.all([
    prisma.teamMember.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    getSetting("company"),
  ]);

  const groups = (Object.keys(departmentLabels) as TeamDepartment[])
    .map((dept) => ({ dept, members: members.filter((m) => m.department === dept) }))
    .filter((g) => g.members.length);

  return (
    <>
      <PageHeader
        eyebrow="Our Team"
        title="The people behind our landmarks"
        description="A dedicated team of leaders, architects, engineers and specialists — united by a commitment to quality."
        image="https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=2000&q=75"
        crumbs={[{ label: "Our Team" }]}
      />
      {groups.map((g, i) => (
        <section key={g.dept} className={cn("section", i % 2 === 1 && "bg-mist")}>
          <div className="container-x">
            <SectionHeading eyebrow={departmentLabels[g.dept]} title={departmentLabels[g.dept] === "Management" ? "Management Team" : departmentLabels[g.dept]} description={intros[g.dept]} />
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {g.members.map((m) => (
                <StaggerItem key={m.id}>
                  <TeamCard member={m} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ))}
      {groups.length === 0 && <p className="section container-x text-center text-muted">Team profiles are coming soon.</p>}
      <CtaSection title="Want to join our team?" text={`We are always looking for talented architects, engineers and project professionals. Send your CV to ${company.email}.`} phone={company.phone} />
    </>
  );
}
