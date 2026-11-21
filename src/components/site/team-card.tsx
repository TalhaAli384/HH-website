import { Tilt } from "@/components/motion/tilt";
import { Mail } from "lucide-react";
import Image from "next/image";

type Member = { name: string; position: string; bio: string | null; photo: string; email: string | null; linkedin: string | null };

export function TeamCard({ member }: { member: Member }) {
  return (
    <Tilt className="h-full rounded-2xl">
      <article className="group overflow-hidden rounded-2xl bg-white shadow-card transition-shadow duration-500 hover:shadow-card-hover">
        <div className="relative aspect-[4/5] overflow-hidden bg-mist">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover grayscale-[30%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {member.bio && <p className="line-clamp-4 text-sm leading-relaxed text-white/85">{member.bio}</p>}
          </div>
        </div>
        <div className="flex items-start justify-between gap-3 p-5">
          <div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="mt-0.5 text-sm text-gold-dark">{member.position}</p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            {member.email && (
              <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`} className="grid h-9 w-9 place-items-center rounded-full bg-mist text-navy transition hover:bg-navy hover:text-white">
                <Mail className="h-4 w-4" />
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on LinkedIn`} className="grid h-9 w-9 place-items-center rounded-full bg-mist text-navy transition hover:bg-navy hover:text-white">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M6.9 21H3.2V9h3.7zM5 7.4A2.1 2.1 0 1 1 7.2 5.3 2.1 2.1 0 0 1 5 7.4zM21 21h-3.7v-5.8c0-1.4 0-3.2-2-3.2s-2.2 1.5-2.2 3.1V21H9.4V9h3.5v1.6a3.9 3.9 0 0 1 3.5-1.9c3.7 0 4.4 2.5 4.4 5.6z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </article>
    </Tilt>
  );
}
