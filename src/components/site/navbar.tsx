"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { mainNav } from "@/config/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

export function Navbar({ phone }: { phone: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Pages with a dark full-bleed hero start with a transparent nav.
  const transparent = !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        transparent ? "bg-transparent py-5" : "bg-white/95 py-3 shadow-[0_1px_0_rgb(16_42_67/0.06),0_8px_30px_-12px_rgb(16_42_67/0.18)] backdrop-blur-md",
      )}
    >
      <nav className="container-x flex items-center justify-between gap-4 xl:gap-6" aria-label="Main">
        <Logo light={transparent} />

        <ul className="hidden items-center lg:flex xl:gap-1">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative rounded-full px-2.5 py-2 text-[14px] font-medium whitespace-nowrap transition-colors xl:px-3.5 xl:text-[14.5px]",
                  transparent ? "text-white/85 hover:text-white" : "text-ink/80 hover:text-navy",
                  isActive(item.href) && (transparent ? "text-white" : "text-navy"),
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-gold xl:inset-x-3.5"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className={cn("hidden items-center gap-2 text-sm font-medium xl:flex", transparent ? "text-white" : "text-navy")}
          >
            <Phone className="h-4 w-4 text-gold" /> {phone}
          </a>
          <ButtonLink href="/quote" size="sm" className="h-10 px-5">
            Get a Quote
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "grid h-11 w-11 place-items-center rounded-full transition lg:hidden",
            transparent ? "text-white hover:bg-white/10" : "text-navy hover:bg-mist",
          )}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100dvh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-y-auto bg-white lg:hidden"
          >
            <motion.ul
              className="container-x flex flex-col gap-1 pt-6 pb-40"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
            >
              {mainNav.map((item) => (
                <motion.li key={item.href} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between border-b border-line py-4 font-display text-xl font-semibold",
                      isActive(item.href) ? "text-gold-dark" : "text-navy",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="mt-6 flex flex-col gap-3">
                <ButtonLink href="/quote" size="lg">
                  Get a Quote
                </ButtonLink>
                <ButtonLink href={`tel:${phone.replace(/\s/g, "")}`} variant="outline" size="lg">
                  <Phone className="h-4 w-4" /> {phone}
                </ButtonLink>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
