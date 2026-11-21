import { CheckCircle2, Clock, FileText, Phone } from "lucide-react";
import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/quote-form";
import { Reveal } from "@/components/motion/reveal";
import { PageHeader } from "@/components/site/page-header";
import { getSetting } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Request a free, no-obligation construction quote from HH Constructions and Developers. Tell us about your project and get a detailed estimate.",
  alternates: { canonical: "/quote" },
};

type Props = { searchParams: Promise<{ type?: string }> };

export default async function QuotePage({ searchParams }: Props) {
  const [{ type }, company] = await Promise.all([searchParams, getSetting("company")]);

  const steps = [
    { icon: FileText, title: "Share your requirements", text: "Tell us about your plot, budget and vision." },
    { icon: Phone, title: "Free consultation", text: "A consultant calls to understand the details." },
    { icon: CheckCircle2, title: "Detailed estimate", text: "Receive an itemised proposal and timeline." },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Request a Quote"
        title="Get a free project estimate"
        description="Share a few details about your project. Our team will prepare a tailored consultation and transparent cost estimate — with no obligation."
        image="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=2000&q=75"
        crumbs={[{ label: "Request a Quote" }]}
      />
      <section className="section bg-mist">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
          <Reveal className="rounded-3xl bg-white p-6 shadow-card sm:p-10 lg:p-12">
            <QuoteForm defaultType={type} />
          </Reveal>
          <aside className="space-y-6">
            <Reveal delay={0.1} className="rounded-2xl bg-navy p-8 text-white">
              <h2 className="text-xl font-semibold text-white">What happens next?</h2>
              <ol className="mt-6 space-y-6">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold font-numeric font-extrabold text-navy">{i + 1}</span>
                    <div>
                      <p className="font-semibold">{s.title}</p>
                      <p className="mt-1 text-sm text-white/65">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal delay={0.15} className="rounded-2xl bg-white p-8 shadow-card">
              <Clock className="h-8 w-8 text-gold" />
              <h2 className="mt-4 text-lg font-semibold">Prefer to talk?</h2>
              <p className="mt-2 text-muted">Call us during office hours ({company.hours}).</p>
              <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="mt-4 block font-numeric text-xl font-extrabold text-navy hover:text-gold-dark">
                {company.phone}
              </a>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
