import { Counter } from "@/components/motion/counter";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Stats({ items, light = false }: { items: { value: number; suffix: string; label: string }[]; light?: boolean }) {
  return (
    <Stagger className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-2xl lg:grid-cols-4", light ? "bg-line" : "bg-white/10")}>
      {items.map((s) => (
        <StaggerItem key={s.label} className={cn("px-4 py-8 text-center sm:px-6 sm:py-10", light ? "bg-white" : "bg-navy")}>
          <p className={cn("font-numeric text-4xl font-extrabold sm:text-5xl", light ? "text-navy" : "text-white")}>
            <Counter value={s.value} suffix={s.suffix} />
          </p>
          <p className={cn("mt-2 text-sm font-medium tracking-wide sm:text-[15px]", light ? "text-muted" : "text-white/60")}>{s.label}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
