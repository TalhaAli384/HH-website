import { ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { CtaSection } from "@/components/site/cta-section";
import { PageHeader } from "@/components/site/page-header";
import { ButtonLink } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/service-icon";
import { prisma } from "@/lib/prisma";
import { getSetting } from "@/lib/settings";
import { cn, paragraphs } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Residential and commercial construction, architectural design, structural engineering, interiors, real estate development, renovation, project management and turnkey solutions.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const [services, home, company] = await Promise.all([
    prisma.service.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    getSetting("home"),
    getSetting("company"),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title="Everything you need to build with confidence"
        description="Integrated design, engineering and construction services — delivered by one experienced, accountable team."
        image="https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=2000&q=75"
        crumbs={[{ label: "Services" }]}
      />

      {/* Quick index */}
      <nav aria-label="Services" className="sticky top-[68px] z-30 hidden border-b border-line bg-white/95 backdrop-blur md:block">
        <ul className="container-x flex gap-1 overflow-x-auto py-3 [scrollbar-width:none]">
          {services.map((s) => (
            <li key={s.id}>
              <a href={`#${s.slug}`} className="block rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap text-ink/70 transition hover:bg-mist hover:text-navy">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        {services.map((service, i) => (
          <section key={service.id} id={service.slug} className={cn("scroll-mt-32 py-16 sm:py-24", i % 2 === 1 && "bg-mist")}>
            <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <Reveal className={cn("relative", i % 2 === 1 && "lg:order-2")}>
                <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                </div>
                <span className="absolute -bottom-6 left-6 grid h-16 w-16 place-items-center rounded-2xl bg-navy text-gold shadow-card-hover">
                  <ServiceIcon name={service.icon} className="h-8 w-8" strokeWidth={1.5} />
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="font-numeric text-sm font-extrabold tracking-[0.2em] text-gold-dark">
                  {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                </p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{service.title}</h2>
                <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
                  {paragraphs(service.description).map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {service.features.length > 0 && (
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold-dark">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        <span className="text-[15px]">{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <ButtonLink href={`/quote?type=${encodeURIComponent(service.title)}`} size="lg" className="mt-9">
                  Inquire About This Service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </ButtonLink>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <CtaSection title={home.ctaTitle} text={home.ctaText} phone={company.phone} />
    </>
  );
}
