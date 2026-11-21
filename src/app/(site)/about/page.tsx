import { CheckCircle2, Eye, Target } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { CtaSection } from "@/components/site/cta-section";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { Stats } from "@/components/site/stats";
import { TeamCard } from "@/components/site/team-card";
import { ButtonLink } from "@/components/ui/button";
import { FeatureIcon } from "@/components/ui/feature-icon";
import { achievements, companyValues, trustPoints } from "@/config/content";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { paragraphs } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about HH Constructions and Developers — our story, vision, mission, values and the experienced team behind our landmark projects.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [about, home, company, leaders] = await Promise.all([
    getSetting("about"),
    getSetting("home"),
    getSetting("company"),
    prisma.teamMember.findMany({ where: { published: true, department: "MANAGEMENT" }, orderBy: { sortOrder: "asc" }, take: 4 }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Engineering excellence, built on trust"
        description="A multi-disciplinary construction and development company delivering quality spaces for families, businesses and investors."
        image="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=2000&q=75"
        crumbs={[{ label: "About Us" }]}
      />

      {/* Story */}
      <section className="section">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">Our Story</p>
            <h2 className="text-3xl leading-tight font-bold sm:text-4xl">Who we are</h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
              {paragraphs(about.story).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ButtonLink href="/projects" variant="navy" size="lg" className="mt-8">
              See Our Work
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.15} className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80" alt="HH Constructions crew at work on a high-rise site" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80" alt="Architect drafting construction drawings" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80" alt="Completed luxury residence with pool" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="section bg-mist">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {[
            { icon: Eye, title: "Our Vision", text: about.vision },
            { icon: Target, title: "Our Mission", text: about.mission },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.1} className="relative overflow-hidden rounded-2xl bg-white p-10 shadow-card">
              <span className="absolute top-0 left-0 h-full w-1 bg-gold" />
              <span className="mb-6 grid h-14 w-14 place-items-center rounded-xl bg-navy text-gold">
                <Icon className="h-7 w-7" strokeWidth={1.6} />
              </span>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container-x">
          <SectionHeading eyebrow="Our Values" title="The principles behind every project" />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companyValues.map((v) => (
              <StaggerItem key={v.title} className="group rounded-2xl border border-line p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card">
                <FeatureIcon name={v.icon} className="h-9 w-9 text-gold" strokeWidth={1.5} />
                <h3 className="mt-5 text-xl font-semibold">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{v.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Experience stats */}
      <section className="bg-navy py-16">
        <div className="container-x">
          <Stats
            items={[
              { value: home.statYears, suffix: "+", label: "Years of Experience" },
              { value: home.statProjects, suffix: "+", label: "Projects Delivered" },
              { value: home.statClients, suffix: "+", label: "Happy Clients" },
              { value: home.statEngineers, suffix: "+", label: "Engineers & Experts" },
            ]}
          />
        </div>
      </section>

      {/* Achievements timeline + trust */}
      <section className="section">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Milestones" title="Our journey and achievements" className="mb-10 sm:mb-10" />
            <ol className="relative space-y-8 border-l-2 border-line pl-8">
              {achievements.map((a, i) => (
                <Reveal as="li" key={a.year} delay={i * 0.08} className="relative">
                  <span className="absolute top-1 -left-[41px] h-4 w-4 rounded-full border-4 border-white bg-gold ring-2 ring-gold/30" />
                  <p className="font-numeric text-sm font-extrabold tracking-wider text-gold-dark">{a.year}</p>
                  <h3 className="mt-1 text-lg font-semibold">{a.title}</h3>
                  <p className="mt-1 text-muted">{a.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal delay={0.1} className="rounded-2xl bg-mist p-8 sm:p-10">
            <p className="eyebrow mb-4">Why Clients Trust Us</p>
            <h2 className="text-3xl font-bold">Accountability at every stage</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Our reputation is built on repeat clients and referrals. We earn that trust through clear communication, documented quality and standing behind our work long after handover.
            </p>
            <ul className="mt-8 space-y-4">
              {trustPoints.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Leadership */}
      {leaders.length > 0 && (
        <section className="section bg-mist">
          <div className="container-x">
            <SectionHeading eyebrow="Leadership" title="Meet our management team" />
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {leaders.map((m) => (
                <StaggerItem key={m.id}>
                  <TeamCard member={m} />
                </StaggerItem>
              ))}
            </Stagger>
            <div className="mt-12 text-center">
              <ButtonLink href="/team" variant="outline" size="lg">
                Meet the Full Team
              </ButtonLink>
            </div>
          </div>
        </section>
      )}

      <CtaSection title={home.ctaTitle} text={home.ctaText} phone={company.phone} />
    </>
  );
}
