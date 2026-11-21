import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-12 max-w-3xl sm:mb-16", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow mb-4", align === "center" && "justify-center", light && "!text-gold")}>{eyebrow}</p>}
      <h2 className={cn("text-3xl leading-tight font-bold sm:text-4xl lg:text-[44px]", light && "text-white")}>{title}</h2>
      {description && (
        <p className={cn("mt-5 text-lg leading-relaxed", light ? "text-white/70" : "text-muted")}>{description}</p>
      )}
    </Reveal>
  );
}
