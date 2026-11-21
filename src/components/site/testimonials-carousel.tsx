"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Testimonial = { id: string; name: string; role: string | null; company: string | null; content: string; rating: number; photo: string | null };

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => go(1), 7000);
    return () => clearInterval(id);
  }, [paused, go, count]);

  if (!count) return null;
  const t = items[index];

  return (
    <div className="relative mx-auto max-w-4xl" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Quote className="mx-auto mb-8 h-12 w-12 text-gold" strokeWidth={1.2} />
      <div className="relative min-h-[280px] sm:min-h-[240px]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="mb-6 flex justify-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={i < t.rating ? "h-5 w-5 fill-gold text-gold" : "h-5 w-5 text-white/20"} />
              ))}
            </div>
            <blockquote className="font-display text-xl leading-relaxed text-white sm:text-2xl">“{t.content}”</blockquote>
            <figcaption className="mt-8 flex items-center justify-center gap-4">
              {t.photo && (
                <Image src={t.photo} alt={t.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover ring-2 ring-gold/60" />
              )}
              <div className="text-left">
                <p className="font-semibold text-white">{t.name}</p>
                <p className="text-sm text-white/60">{[t.role, t.company].filter(Boolean).join(", ")}</p>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      {count > 1 && (
        <div className="mt-10 flex items-center justify-center gap-6">
          <button onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-gold hover:bg-gold hover:text-navy">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {items.map((item, i) => (
              <button
                key={item.id}
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-gold" : "w-2 bg-white/30 hover:bg-white/50"}`}
              />
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-gold hover:bg-gold hover:text-navy">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
