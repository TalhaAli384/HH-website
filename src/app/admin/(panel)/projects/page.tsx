import { Pencil, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { deleteProject } from "@/actions/projects";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState, Flash, PageTitle, Pill, TableWrap } from "@/components/admin/ui";
import { projectCategoryLabels, projectStatusLabels } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { cn, formatDate } from "@/lib/utils";
import type { ProjectStatus } from "@/generated/prisma/enums";

type Props = { searchParams: Promise<{ saved?: string; status?: string; q?: string }> };

export default async function AdminProjectsPage({ searchParams }: Props) {
  const { saved, status, q } = await searchParams;
  const statusFilter = (["COMPLETED", "ONGOING", "UPCOMING"] as const).find((s) => s === status) as ProjectStatus | undefined;

  const projects = await prisma.project.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { location: { contains: q, mode: "insensitive" } }] } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { images: true } } },
  });

  const tabs = [{ value: undefined, label: "All" }, ...(["ONGOING", "COMPLETED", "UPCOMING"] as const).map((s) => ({ value: s, label: projectStatusLabels[s] }))];

  return (
    <div>
      <PageTitle title="Projects" description="Manage your portfolio of completed, ongoing and upcoming projects." action={{ href: "/admin/projects/new", label: "New project" }} />
      <Flash show={saved === "1"} message="Project saved successfully." />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <Link
              key={t.label}
              href={t.value ? `/admin/projects?status=${t.value}` : "/admin/projects"}
              className={cn("rounded-full px-4 py-2 text-sm font-medium transition", statusFilter === t.value ? "bg-navy text-white" : "bg-white text-ink/70 hover:text-navy")}
            >
              {t.label}
            </Link>
          ))}
        </div>
        <form className="w-full sm:w-72">
          {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
          <input name="q" defaultValue={q} placeholder="Search title or location…" className="field py-2.5" />
        </form>
      </div>

      {projects.length ? (
        <TableWrap>
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Status</th>
              <th>Visibility</th>
              <th>Updated</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-mist">
                      <Image src={p.coverImage} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <Link href={`/admin/projects/${p.id}`} className="flex items-center gap-1.5 font-semibold text-navy hover:text-gold-dark">
                        {p.title} {p.featured && <Star className="h-3.5 w-3.5 fill-gold text-gold" />}
                      </Link>
                      <p className="truncate text-xs text-muted">{p.location} · {p._count.images + 1} images</p>
                    </div>
                  </div>
                </td>
                <td>{projectCategoryLabels[p.category]}</td>
                <td>
                  <Pill tone={p.status === "COMPLETED" ? "green" : p.status === "ONGOING" ? "gold" : "navy"}>{projectStatusLabels[p.status]}</Pill>
                </td>
                <td>{p.published ? <Pill tone="green">Published</Pill> : <Pill>Hidden</Pill>}</td>
                <td className="whitespace-nowrap text-muted">{formatDate(p.updatedAt)}</td>
                <td>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/projects/${p.id}`} className="rounded-lg p-2 text-navy hover:bg-mist" aria-label={`Edit ${p.title}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteButton compact action={deleteProject.bind(null, p.id)} label={`Delete ${p.title}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      ) : (
        <EmptyState message={q || statusFilter ? "No projects match your filters." : "No projects yet."} action={{ href: "/admin/projects/new", label: "Add your first project" }} />
      )}
    </div>
  );
}
