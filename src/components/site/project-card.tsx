import { Tilt } from "@/components/motion/tilt";
import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { projectCategoryLabels, projectStatusLabels } from "@/config/site";
import { cn } from "@/lib/utils";
import type { ProjectCategory, ProjectStatus } from "@/generated/prisma/enums";

export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  location: string;
  coverImage: string;
  category: ProjectCategory;
  status: ProjectStatus;
};

const statusStyles: Record<ProjectStatus, string> = {
  COMPLETED: "bg-emerald-500/90 text-white",
  ONGOING: "bg-gold text-navy",
  UPCOMING: "bg-white/90 text-navy",
};

export function ProjectCard({ project, priority = false }: { project: ProjectCardData; priority?: boolean }) {
  return (
    <Tilt className="h-full rounded-2xl">
      <Link
        href={`/projects/${project.slug}`}
        className="group relative block overflow-hidden rounded-2xl bg-navy shadow-card transition-shadow duration-500 hover:shadow-card-hover"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
          <span className={cn("absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold", statusStyles[project.status])}>
            {projectStatusLabels[project.status]}
          </span>
          <span className="absolute top-4 right-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white text-navy opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-5 w-5" />
          </span>
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-gold uppercase">
              {projectCategoryLabels[project.category]}
            </p>
            <h3 className="text-xl font-semibold text-white">{project.title}</h3>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
              <MapPin className="h-4 w-4" /> {project.location}
            </p>
            <p className="mt-0 max-h-0 overflow-hidden text-sm leading-relaxed text-white/75 opacity-0 transition-all duration-500 group-hover:mt-3 group-hover:max-h-24 group-hover:opacity-100">
              {project.summary}
            </p>
          </div>
        </div>
      </Link>
    </Tilt>
  );
}
