"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { projectCategoryLabels, projectStatusLabels } from "@/config/site";
import { cn } from "@/lib/utils";
import type { ProjectCategory, ProjectStatus } from "@/generated/prisma/enums";
import { ProjectCard, type ProjectCardData } from "./project-card";

type StatusFilter = "ALL" | ProjectStatus;
type CategoryFilter = "ALL" | ProjectCategory;

export function ProjectGrid({ projects, initialStatus = "ALL" }: { projects: (ProjectCardData & { id: string })[]; initialStatus?: StatusFilter }) {
  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [category, setCategory] = useState<CategoryFilter>("ALL");

  const categories = useMemo(
    () => (Object.keys(projectCategoryLabels) as ProjectCategory[]).filter((c) => projects.some((p) => p.category === c)),
    [projects],
  );

  const filtered = projects.filter((p) => (status === "ALL" || p.status === status) && (category === "ALL" || p.category === category));
  const count = (s: StatusFilter) => (s === "ALL" ? projects.length : projects.filter((p) => p.status === s).length);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Project status" className="flex flex-wrap gap-2 rounded-full bg-mist p-1.5 sm:inline-flex">
          {(["ALL", "COMPLETED", "ONGOING", "UPCOMING"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={status === s}
              onClick={() => setStatus(s)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:px-5",
                status === s ? "text-white" : "text-ink/70 hover:text-navy",
              )}
            >
              {status === s && <motion.span layoutId="status-pill" className="absolute inset-0 rounded-full bg-navy" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
              <span className="relative">
                {s === "ALL" ? "All Projects" : projectStatusLabels[s]} <span className="font-numeric opacity-60">({count(s)})</span>
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Project category">
          {(["ALL", ...categories] as CategoryFilter[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                category === c ? "border-gold bg-gold text-navy" : "border-line text-ink/70 hover:border-navy/30 hover:text-navy",
              )}
            >
              {c === "ALL" ? "All Categories" : projectCategoryLabels[c]}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && (
        <p className="rounded-2xl bg-mist py-16 text-center text-muted">No projects match these filters yet  try another category.</p>
      )}
    </div>
  );
}
