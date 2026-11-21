import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/site/page-header";
import { SocialLinks } from "@/components/site/social-links";
import { getSetting } from "@/lib/settings";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with HH Constructions and Developers. Call, email, WhatsApp or visit our office to discuss your construction project.",
  alternates: { canonical: "/contact" },
};

function mapSrc(query: string) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const q = encodeURIComponent(query);
  return key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}`
    : `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
}

export default async function ContactPage() {
  const company = await getSetting("company");
  const tel = company.phone.replace(/\s/g, "");

  const cards = [
    { icon: Phone, title: "Call Us", lines: [...new Set([company.phone, company.phoneAlt].filter(Boolean))], href: `tel:${tel}` },
    { icon: Mail, title: "Email Us", lines: [company.email], href: `mailto:${company.email}` },
    { icon: MessageCircle, title: "WhatsApp", lines: ["Chat with our team instantly"], href: `https://wa.me/${company.whatsapp}` },
    { icon: MapPin, title: "Visit Our Office", lines: [company.address], href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapQuery)}` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Let's talk about your project"
        description="Whether you're planning a new home, a commercial building or a complete development, our team is ready to help."
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000&q=75"
        crumbs={[{ label: "Contact" }]}
      />

      <section className="relative z-10 -mt-12">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-navy text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
                  <c.icon className="h-6 w-6" />
                </span>
                <h2 className="text-lg font-semibold">{c.title}</h2>
                {c.lines.map((l) => (
                  <p key={l} className="mt-1 text-[15px] break-words text-muted">{l}</p>
                ))}
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow mb-4">Send a Message</p>
            <h2 className="text-3xl font-bold sm:text-4xl">How can we help you?</h2>
            <p className="mt-4 mb-10 text-lg text-muted">Fill in the form and a member of our team will respond within one business day.</p>
            <ContactForm />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-6">
            <div className="relative min-h-[360px] flex-1 overflow-hidden rounded-2xl bg-mist shadow-card">
              <iframe
                title={`Map showing ${company.address}`}
                src={mapSrc(company.mapQuery)}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="rounded-2xl bg-navy p-8 text-white">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Clock className="h-5 w-5 text-gold" /> Office Hours
              </h2>
              <p className="mt-2 text-white/70">{company.hours}</p>
              <p className="mt-6 mb-3 text-sm font-semibold tracking-wider text-white/50 uppercase">Follow us</p>
              <SocialLinks company={company} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
