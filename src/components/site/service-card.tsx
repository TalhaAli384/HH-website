import { Tilt } from "@/components/motion/tilt";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ServiceIcon } from "@/components/ui/service-icon";

export function ServiceCard({ service }: { service: { slug: string; title: string; summary: string; icon: string } }) {
  return (
    <Tilt className="h-full rounded-2xl">
      <Link
        href={`/services#${service.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-8 shadow-card transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:shadow-card-hover"
      >
        <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
        <span className="mb-6 grid h-14 w-14 place-items-center rounded-xl bg-mist text-navy transition-colors duration-500 group-hover:bg-navy group-hover:text-gold">
          <ServiceIcon name={service.icon} className="h-7 w-7" strokeWidth={1.6} />
        </span>
        <h3 className="text-xl font-semibold">{service.title}</h3>
        <p className="mt-3 flex-1 leading-relaxed text-muted">{service.summary}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy">
          Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </Tilt>
  );
}
