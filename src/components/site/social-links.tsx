import { cn } from "@/lib/utils";
import type { CompanyInfo } from "@/config/site";

// Brand glyphs aren't in lucide-react 1.x, so they're inlined as simple paths.
const glyphs = {
  facebook: "M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z",
  instagram:
    "M12 7.4A4.6 4.6 0 1 0 16.6 12 4.6 4.6 0 0 0 12 7.4zm0 7.6a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm5.9-7.8a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1zM21 7.2a5.3 5.3 0 0 0-1.5-3.7A5.3 5.3 0 0 0 15.8 2C14.3 2 9.7 2 8.2 2a5.3 5.3 0 0 0-3.7 1.5A5.3 5.3 0 0 0 3 7.2C3 8.7 3 15.3 3 16.8a5.3 5.3 0 0 0 1.5 3.7A5.3 5.3 0 0 0 8.2 22c1.5 0 6.1 0 7.6 0a5.3 5.3 0 0 0 3.7-1.5 5.3 5.3 0 0 0 1.5-3.7c.1-1.5.1-8.1 0-9.6z",
  linkedin:
    "M6.9 21H3.2V9h3.7zM5 7.4A2.1 2.1 0 1 1 7.2 5.3 2.1 2.1 0 0 1 5 7.4zM21 21h-3.7v-5.8c0-1.4 0-3.2-2-3.2s-2.2 1.5-2.2 3.1V21H9.4V9h3.5v1.6a3.9 3.9 0 0 1 3.5-1.9c3.7 0 4.4 2.5 4.4 5.6z",
  youtube:
    "M22 7.2a2.8 2.8 0 0 0-2-2C18.3 4.7 12 4.7 12 4.7s-6.3 0-8 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.6 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.5 8 .5 8 .5s6.3 0 8-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .4-4.8 29 29 0 0 0-.4-4.8zM9.9 15V9l5.2 3z",
};

export function SocialLinks({ company, className }: { company: CompanyInfo; className?: string }) {
  const links = (Object.keys(glyphs) as (keyof typeof glyphs)[]).filter((k) => company[k]);
  if (!links.length) return null;
  return (
    <ul className={cn("flex gap-3", className)}>
      {links.map((k) => (
        <li key={k}>
          <a
            href={company[k]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={k}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-navy"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d={glyphs[k]} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
