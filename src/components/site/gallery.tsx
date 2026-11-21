"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Img = { id: string; url: string; caption: string | null };

export function Gallery({ images, title }: { images: Img[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);
  const count = images.length;

  const step = useCallback((dir: number) => setActive((i) => (i === null ? i : (i + dir + count) % count)), [count]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, step]);

  if (!count) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className={`group relative overflow-hidden rounded-xl bg-mist ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto" : "aspect-[4/3]"}`}
            aria-label={`View image ${i + 1}${img.caption ? `: ${img.caption}` : ""}`}
          >
            <Image src={img.url} alt={img.caption ?? `${title} — image ${i + 1}`} fill sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"} className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 grid place-items-center bg-navy/0 transition-colors duration-300 group-hover:bg-navy/40">
              <Expand className="h-8 w-8 scale-75 text-white opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <button className="absolute top-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close" onClick={() => setActive(null)}>
              <X className="h-6 w-6" />
            </button>
            {count > 1 && (
              <>
                <button className="absolute left-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6" aria-label="Previous image" onClick={(e) => { e.stopPropagation(); step(-1); }}>
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button className="absolute right-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6" aria-label="Next image" onClick={(e) => { e.stopPropagation(); step(1); }}>
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-[75vh] w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[active].url} alt={images[active].caption ?? title} fill sizes="100vw" className="object-contain" />
              <figcaption className="absolute -bottom-10 inset-x-0 text-center text-sm text-white/70">
                {images[active].caption} <span className="font-numeric text-white/40">· {active + 1} / {count}</span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
