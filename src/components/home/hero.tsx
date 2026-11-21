"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { HeroScene } from "@/components/three/lazy";
import { ButtonLink } from "@/components/ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Split "Building Dreams. Creating Landmarks." into lines on sentence breaks.
  const lines = title.split(/(?<=\.)\s+/);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy-950">
      <motion.div style={{ y }} className="absolute inset-0 -z-20">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
          className="relative h-full w-full"
        
        >
          <Image src={image} alt="Modern high-rise architecture by  High Horizon Constructions" fill priority sizes="100vw" className="object-cover opacity-45" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
      {/* 3D construction scene: full-bleed and subtle on phones, right-hand stage on desktop */}
      <HeroScene className="pointer-events-none absolute inset-0 -z-10 opacity-35 md:opacity-60 lg:left-[46%] lg:opacity-100 xl:left-[38%]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-[55%] bg-gradient-to-r from-navy-950/90 to-transparent lg:block" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy-950/80 to-transparent" />

      <motion.div style={{ opacity: fade }} className="container-x pt-28 pb-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
        >
        </motion.p>
        <h1 className="max-w-4xl text-[40px] leading-[1.05] font-bold text-white sm:text-6xl lg:max-w-xl lg:text-[56px] xl:max-w-2xl xl:text-[76px]">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                className={i === lines.length - 1 ? "block text-gold" : "block"}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.35 + i * 0.15 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.8 }}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl lg:max-w-xl"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 1 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <ButtonLink href="/quote" size="lg">
            Get a Free Consultation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink href="/projects" variant="outline-light" size="lg">
            Explore Our Projects
          </ButtonLink>
        </motion.div>
      </motion.div>

      <motion.a
        href="#intro"
        aria-label="Scroll to content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.25em] text-white/60 uppercase sm:flex"
      >
        Scroll
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.a>
    </section>
  );
}
