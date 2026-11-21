import Image from "next/image";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const photos = [
  { id: "1613490493576-7fde63acd811", label: "Luxury Residences", span: "md:col-span-2 md:row-span-2" },
  { id: "1504307651254-35680f356dfd", label: "High-Rise Construction", span: "" },
  { id: "1600607687939-ce8a6c25118c", label: "Interior Design", span: "" },
  { id: "1554469384-e58fac16e23a", label: "Commercial Architecture", span: "" },
  { id: "1531834685032-c34bf0d84c77", label: "Structural Works", span: "" },
  { id: "1600047509807-ba8f99d2cdde", label: "Modern Homes", span: "col-span-2" },
  { id: "1541888946425-d81bb19240f5", label: "Site Management", span: "" },
  { id: "1600210492486-724fe5c67fb0", label: "Living Spaces", span: "" },
];

export function WorkGallery() {
  return (
    <Stagger className="grid auto-rows-[200px] grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[220px] md:grid-cols-4">
      {photos.map((p, i) => (
        <StaggerItem key={p.id} className={cn("group relative overflow-hidden rounded-2xl bg-navy", p.span, i === 0 && "col-span-2 row-span-2")}>
          <Link href="/projects" className="absolute inset-0" aria-label={`${p.label} — view projects`}>
            <Image
              src={`https://images.unsplash.com/photo-${p.id}?w=${i === 0 ? 1400 : 800}&q=80`}
              alt={p.label}
              fill
              sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 sm:p-5">
              <span className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-10" />
              <span className="font-display text-sm font-semibold text-white sm:text-base">{p.label}</span>
            </span>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
