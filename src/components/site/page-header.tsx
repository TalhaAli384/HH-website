import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Crumb = { label: string; href?: string };

export function PageHeader({
  eyebrow,
  title,
  description,
  image,
  crumbs = [],
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-navy pt-36 pb-16 sm:min-h-[480px] sm:pb-20">
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy/85 to-navy/50" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-navy-950/60 to-transparent" />
      <div className="container-x">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
            <li>
              <Link href="/" className="hover:text-gold">
                Home
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-gold">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white/90" aria-current="page">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="eyebrow mb-4 !text-gold">{eyebrow}</p>}
        <h1 className="max-w-4xl text-4xl leading-[1.1] font-bold text-white sm:text-5xl lg:text-6xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{description}</p>}
      </div>
    </section>
  );
}
