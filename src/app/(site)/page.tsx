import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Hero } from "@/components/home/hero";
import { WorkGallery } from "@/components/home/work-gallery";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { BlogCard } from "@/components/site/blog-card";
import { CtaSection } from "@/components/site/cta-section";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { ServiceCard } from "@/components/site/service-card";
import { Stats } from "@/components/site/stats";
import { TestimonialsCarousel } from "@/components/site/testimonials-carousel";
import { ButtonLink } from "@/components/ui/button";
import { FeatureIcon } from "@/components/ui/feature-icon";
import { processSteps, trustPoints, whyChooseUs } from "@/config/content";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";

export const revalidate = 300;

export default async function HomePage() {
  const [home, company, services, projects, testimonials, posts] = await Promise.all([
    getSetting("home"),
    getSetting("company"),
    prisma.service.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { sortOrder: "asc" }], take: 6 }),
    prisma.project.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }], take: 6 }),
    prisma.testimonial.findMany({ where: { published: true, featured: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { category: { select: { name: true } } },
    }),
  ]);

  const stats = [
    { value: home.statYears, suffix: "+", label: "Years of Experience" },
    { value: home.statProjects, suffix: "+", label: "Projects Delivered" },
    { value: home.statClients, suffix: "+", label: "Happy Clients" },
    { value: home.statEngineers, suffix: "+", label: "Engineers & Experts" },
  ];

  return (
    <>
      <Hero title={home.heroTitle} subtitle={home.heroSubtitle} image={home.heroImage} />

      {/* Stats band overlapping the hero edge */}
      <section className="relative z-10 -mt-16 sm:-mt-20">
        <div className="container-x">
          <div className="rounded-2xl shadow-card-hover">
            <Stats items={stats} />
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section id="intro" className="section scroll-mt-20">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9?w=1200&q=80"
                alt="HH Constructions engineers reviewing progress on site"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-2 -bottom-8 w-56 rounded-2xl bg-gold p-6 shadow-card-hover sm:-right-6">
              <p className="font-numeric text-5xl font-extrabold text-navy">{home.statYears}+</p>
              <p className="mt-1 text-sm font-semibold text-navy/80">Years building with excellence</p>
            </div>
            <div className="absolute -top-6 -left-6 -z-10 hidden h-40 w-40 rounded-2xl border-2 border-gold/40 sm:block" />
          </Reveal>
          <Reveal delay={0.15}>
            <h2 className="text-3xl leading-tight font-bold sm:text-4xl lg:text-[44px]">{home.introTitle}</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">{home.introText}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-[15px] text-ink">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" /> {point}
                </li>
              ))}
            </ul>
            <ButtonLink href="/about" variant="navy" size="lg" className="mt-10">
              Discover Our Story <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-mist">
        <div className="container-x">
          <SectionHeading
            eyebrow="What We Do"
            title="Comprehensive construction services"
            description="From concept and design to construction and handover one accountable partner for your entire project."
          />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-12 text-center">
            <ButtonLink href="/services" variant="outline" size="lg">
              View All Services <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* Featured projects */}
      <section className="section">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              align="left"
              eyebrow="Our Portfolio"
              title="Featured construction projects"
              description="A selection of landmark homes, commercial buildings and developments we are proud to have built."
              className="mb-0 sm:mb-0"
            />
            <Reveal>
              <ButtonLink href="/projects" variant="outline" className="shrink-0">
                All Projects <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </Reveal>
          </div>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <StaggerItem key={project.id}>
                <ProjectCard project={project} priority={i < 3} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section relative overflow-hidden bg-navy">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:56px_56px]" />
        <div className="container-x relative">
          <SectionHeading
            light
            eyebrow="Why Choose Us"
            title="Built on trust, delivered with precision"
            description="Clients choose High Horizon Marketing for our engineering depth, transparent process and the quality that shows in every finished project."
          />
          <Stagger className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <StaggerItem key={item.title} className="group bg-navy p-8 transition-colors duration-500 hover:bg-navy-700 sm:p-10">
                <span className="mb-6 grid h-14 w-14 place-items-center rounded-xl bg-gold/10 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-navy">
                  <FeatureIcon name={item.icon} className="h-7 w-7" strokeWidth={1.6} />
                </span>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-white/65">{item.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Process */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="How We Work"
            title="A proven five tep process"
            description="A clear, structured approach that keeps you informed and in control at every stage."
          />
          <Stagger className="relative grid gap-10 md:grid-cols-5 md:gap-6">
            <div className="absolute top-8 right-[10%] left-[10%] hidden h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent md:block" />
            {processSteps.map((step, i) => (
              <StaggerItem key={step.title} className="relative text-center">
                <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full border-2 border-gold bg-white font-numeric text-xl font-extrabold text-navy shadow-card">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-muted">{step.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Photo gallery */}
      <section className="section bg-mist">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Work in Pictures"
            title="Craftsmanship you can see"
            description="From the first foundation to the final finish  a glimpse of our sites, teams and completed spaces."
          />
          <WorkGallery />
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section relative overflow-hidden bg-charcoal">
          <Image
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1800&q=60"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-10"
          />
          <div className="container-x relative">
            <SectionHeading light eyebrow="Testimonials" title="What our clients say" />
            <TestimonialsCarousel items={testimonials} />
          </div>
        </section>
      )}

      {/* Latest news */}
      {posts.length > 0 && (
        <section className="section bg-mist">
          <div className="container-x">
            <SectionHeading eyebrow="News & Insights" title="Latest from our blog" />
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <StaggerItem key={post.id}>
                  <BlogCard post={post} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <CtaSection title={home.ctaTitle} text={home.ctaText} phone={company.phone} />
    </>
  );
}
