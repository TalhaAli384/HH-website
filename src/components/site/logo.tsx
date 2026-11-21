import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("group flex shrink-0 items-center gap-2.5 sm:gap-3", className)} aria-label="HH Constructions and Developers — Home">
      <Image
        src="/logo.png"
        alt=""
        width={52}
        height={52}
        priority
        className="h-12 w-12 shrink-0 drop-shadow-[0_4px_12px_rgb(0_0_0/0.25)] transition-transform duration-500 group-hover:rotate-[-8deg] sm:h-[52px] sm:w-[52px]"
      />
      <span className="leading-tight whitespace-nowrap">
        <span className={cn("block font-display text-[15px] font-bold tracking-tight sm:text-[17px] lg:text-[15px] xl:text-[17px]", light ? "text-white" : "text-navy")}>
           High Horizon Marketing
        </span>
        <span className={cn("block text-[10px] font-semibold tracking-[0.28em]", light ? "text-gold-light" : "text-gold-dark")}>
          AND DEVELOPERS
        </span>
      </span>
    </Link>
  );
}
