import { ArrowRight, Phone } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { LogoCoin } from "@/components/three/lazy";
import { ButtonLink } from "@/components/ui/button";

export function CtaSection({ title, text, phone }: { title: string; text: string; phone: string }) {
  return (
    <section className="section">
      <div className="container-x">
        <Reveal className="relative isolate overflow-hidden rounded-3xl bg-navy px-6 py-16 sm:px-12 lg:px-20 lg:py-20">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1800&q=75"
            alt=""
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="-z-20 object-cover opacity-25"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/60" />
          <div className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full border-[40px] border-gold/10" />
          <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">{title}</h2>
              <p className="mt-5 max-w-xl text-lg text-white/75">{text}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/quote" size="lg">
                Get a Free Consultation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink href={`tel:${phone.replace(/\s/g, "")}`} variant="outline-light" size="lg">
                <Phone className="h-4 w-4" /> {phone}
              </ButtonLink>
              </div>
            </div>
            <LogoCoin className="order-1 mx-auto h-44 w-44 sm:h-56 sm:w-56 lg:order-2 lg:h-80 lg:w-80" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
