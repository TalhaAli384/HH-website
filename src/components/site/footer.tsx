import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { mainNav, siteConfig, type CompanyInfo } from "@/config/site";
import { Logo } from "./logo";
import { SocialLinks } from "./social-links";

const serviceLinks = [
  "Residential Construction",
  "Commercial Construction",
  "Architectural Design",
  "Real Estate Development",
  "Turnkey Solutions",
];

export function Footer({ company }: { company: CompanyInfo }) {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white/70">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="container-x relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed">
            {siteConfig.description}
          </p>
          <SocialLinks company={company} className="mt-6" />
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-5 text-sm font-semibold tracking-[0.18em] text-white uppercase">Company</h2>
          <ul className="space-y-3 text-[15px]">
            {mainNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/quote" className="transition hover:text-gold">
                Request a Quote
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="mb-5 text-sm font-semibold tracking-[0.18em] text-white uppercase">Services</h2>
          <ul className="space-y-3 text-[15px]">
            {serviceLinks.map((s) => (
              <li key={s}>
                <Link href="/services" className="transition hover:text-gold">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="mb-5 text-sm font-semibold tracking-[0.18em] text-white uppercase">Get in Touch</h2>
          <ul className="space-y-4 text-[15px]">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <span>{company.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <span className="flex flex-col gap-1">
                {[...new Set([company.phone, company.phoneAlt].filter(Boolean))].map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="transition hover:text-gold">
                    {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <a href={`mailto:${company.email}`} className="break-all transition hover:text-gold">
                {company.email}
              </a>
            </li>
            {company.hours && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>{company.hours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-sm sm:flex-row">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="flex items-center gap-4 text-white/50">
            {siteConfig.tagline}
            <Link href="/admin/login" className="text-white/40 underline-offset-4 transition hover:text-gold hover:underline">
              Owner login
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
