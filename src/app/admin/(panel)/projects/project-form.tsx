"use client";

import { ActionForm } from "@/components/admin/action-form";
import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProject } from "@/actions/projects";
import { Checkbox, FormCard, SelectField, TextArea, TextField } from "@/components/admin/fields";
import { ActionMessage, SubmitButton } from "@/components/admin/form-feedback";
import { ImageUpload } from "@/components/admin/image-upload";
import { projectCategoryLabels, projectStatusLabels } from "@/config/site";
import type { ActionState } from "@/lib/action-utils";
import type { Project } from "@/generated/prisma/client";
import { ProjectGalleryUpload } from "./project-gallery-upload";

const toDateInput = (d: Date | null | undefined) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export function ProjectForm({ project }: { project?: Project }) {
  const [state, action] = useActionState<ActionState, FormData>(saveProject.bind(null, project?.id ?? null), {});
  const [galleryUploading, setGalleryUploading] = useState(false);
  const e = state.fieldErrors;
  const specs = ((project?.specifications as { label: string; value: string }[] | undefined) ?? []).map((s) => `${s.label}: ${s.value}`).join("\n");

  return (
    <ActionForm action={action} className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <FormCard title="Project information">
          <TextField name="title" label="Title" required defaultValue={project?.title} errors={e} />
          <TextField name="slug" label="URL slug" defaultValue={project?.slug} errors={e} hint="Leave blank to generate from the title." />
          <TextArea name="summary" label="Short summary" required rows={2} defaultValue={project?.summary} errors={e} hint="Shown on project cards (max 300 characters)." />
          <TextArea name="description" label="Full description" required rows={8} defaultValue={project?.description} errors={e} hint="Separate paragraphs with a blank line." />
        </FormCard>
        <FormCard title="Details & specifications">
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField name="category" label="Category" required defaultValue={project?.category ?? "RESIDENTIAL"} errors={e} options={Object.entries(projectCategoryLabels).map(([value, label]) => ({ value, label }))} />
            <SelectField name="status" label="Status" required defaultValue={project?.status ?? "ONGOING"} errors={e} options={Object.entries(projectStatusLabels).map(([value, label]) => ({ value, label }))} />
            <TextField name="location" label="Location" required defaultValue={project?.location} errors={e} />
            <TextField name="client" label="Client" defaultValue={project?.client ?? ""} errors={e} />
            <TextField name="area" label="Covered area" defaultValue={project?.area ?? ""} errors={e} placeholder="e.g. 12,500 sq ft" />
            <TextField name="floors" label="Floors" type="number" min={0} defaultValue={project?.floors ?? ""} errors={e} />
            <TextField name="budget" label="Project value" defaultValue={project?.budget ?? ""} errors={e} placeholder="Optional" />
            <div className="grid grid-cols-2 gap-3">
              <TextField name="startDate" label="Start date" type="date" defaultValue={toDateInput(project?.startDate)} errors={e} />
              <TextField name="completionDate" label="Completion" type="date" defaultValue={toDateInput(project?.completionDate)} errors={e} />
            </div>
          </div>
          <TextArea name="specifications" label="Specifications" rows={6} defaultValue={specs} errors={e} hint='One per line as "Label: Value", e.g. "Structure: RCC frame".' />
        </FormCard>
        {!project && (
          <FormCard title="Project gallery" description="Upload multiple images. Captions and order appear on the public project page.">
            <ProjectGalleryUpload onUploadingChange={setGalleryUploading} />
          </FormCard>
        )}
      </div>
      <div className="space-y-6">
        <FormCard title="Cover image">
          <ImageUpload name="coverImage" idName="coverImageId" label="Cover" required defaultUrl={project?.coverImage} defaultId={project?.coverImageId} error={e?.coverImage?.[0]} />
        </FormCard>
        <FormCard title="Visibility">
          <Checkbox name="published" label="Published" description="Visible on the public website" defaultChecked={project?.published ?? true} />
          <Checkbox name="featured" label="Featured" description="Highlight on the home page" defaultChecked={project?.featured ?? false} />
        </FormCard>
        <div className="space-y-4 xl:sticky xl:top-6">
          <ActionMessage state={state} />
          <div className="flex items-center gap-3">
            <SubmitButton disabled={galleryUploading}>{project ? "Save changes" : "Create project"}</SubmitButton>
            <Link href="/admin/projects" className="px-3 py-2 text-sm font-medium text-muted hover:text-navy">Cancel</Link>
          </div>
        </div>
      </div>
    </ActionForm>
  );
}
