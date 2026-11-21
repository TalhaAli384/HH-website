import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FormCard } from "@/components/admin/fields";
import { Flash, PageTitle } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../project-form";
import { ProjectGalleryManager } from "./gallery-manager";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function EditProjectPage({ params, searchParams }: Props) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const project = await prisma.project.findUnique({ where: { id }, include: { images: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } } });
  if (!project) notFound();

  return (
    <div>
      <PageTitle title={`Edit: ${project.title}`} description="Update project details, images and visibility." />
      <Flash show={created === "1"} message="Project created successfully. Manage gallery images below." />
      {project.published && (
        <Link href={`/projects/${project.slug}`} target="_blank" className="-mt-4 mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-dark">
          View on website <ExternalLink className="h-4 w-4" />
        </Link>
      )}
      <ProjectForm project={project} />
      <FormCard title="Project gallery" description="Upload multiple images. Captions and order appear on the public project page." className="mt-6">
        <ProjectGalleryManager projectId={project.id} images={project.images} />
      </FormCard>
    </div>
  );
}
